/* eslint-disable @typescript-eslint/no-explicit-any */
//const url = require('url');
import net from 'net';
import EventEmitter from 'events';
import http from 'http';
import stream from 'stream';
import { session } from 'electron'
import url from 'url'
import querystring from 'querystring'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const remote = require('electron').remote;

class ProxyServer extends EventEmitter {
  address = '0.0.0.0';
  port = 9090;

  Server!: net.Server;
  remote!: net.Socket;

  agent = new http.Agent({
    keepAlive: true,
  });
  load = () => {
    this.Server = http.createServer(this.createServer);
    this.Server.on('error', this.errorHandler);
    this.Server.on('connection', this.onConnect);
    this.Server.on('close', () => {
      console.log('client disconnected');
    });
    const listenport = 0;
    //Start listening
    this.Server.listen(
      {
        host: this.address,
        port: listenport,
      },
      ()=>{
        this.port = (this.Server.address() as net.AddressInfo).port;
        this.setProxy()
        //console.log(`Server listening on ${this.address}:${this.port} `);
      }
    );
  };

  setProxy = async () => {
    const httpsProxy = 'direct://'
    const httpProxy = `http://0.0.0.0:${this.port},direct://`
    
    //Set Proxy
    await session.defaultSession.setProxy({
      proxyRules: `http=${httpProxy};https=${httpsProxy}`,
      proxyBypassRules: '<local>;*.google-analytics.com;*.doubleclick.net',
    })
    console.log(`Proxy listening on ${this.port}, upstream proxy ${httpProxy}`)
  }

  createServer = async (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => {
    // Prepare request headers
    delete req.headers['proxy-connection'];
    req.headers['connection'] = 'close';
    
    // Prepare request options
    const rawReqBody = req.rawHeaders;
    const reqBody = JSON.stringify(querystring.parse(rawReqBody.toString()))
    const requestInfo = [req.headers.origin, req.url, req.url]
    console.log('proxy in createServer')
    res.end();
  };
  onConnect = (clientSocket: net.Socket) => {
    // 接上proxy後執行
    console.log('client connected to proxy');
    clientSocket.once('data', (data: {toString: () => string}) => {
      //console.log(data.toString())
      const msg = data.toString();
      const isTLSConnection = msg.indexOf('CONNECT') !== -1;

      let serverPort = 80;
      let serverAddress = '';

      if (isTLSConnection) {
        serverPort = 443;

        serverAddress = data
          .toString()
          .split('CONNECT')[1]
          .split(' ')[1]
          .split(':')[0];
      } else {
        serverAddress = data.toString().split('Host: ')[1].split('\r\n')[0];
        //.split('\r')[0];
      }

      if (serverAddress.includes('osapi')) {
        console.log('');
      }

      try {
        const proxyToServerSocket = net.createConnection(
          {
            host: serverAddress,
            port: serverPort,
          },
          () => {
            //接上外面後執行
            //console.log('Proxy to Server set up');
            if (isTLSConnection) {
              clientSocket.write('HTTP/1.1 200 OK \r\n\n');

              const msg = data.toString();
              if (msg.includes('dmm')) {
                console.log(data.toString());
              }
            } else {
              if (!proxyToServerSocket.destroyed) {
                proxyToServerSocket.write(msg);
              }
            }

            clientSocket.pipe(proxyToServerSocket);
            proxyToServerSocket.pipe(clientSocket);

            proxyToServerSocket.on('error', (err: any) => {
              if (!err.message.includes('ECONNRESET')) {
                console.log(`Proxy to ${serverAddress} error: ${err?.message}`);
              }
            });
            proxyToServerSocket.on('end', () => {
              //clientSocket.destory();
            });
            proxyToServerSocket.on('timeout', () => {
              //
            });
          }
        );
      } catch (error) {
        console.log(error);
      }

      clientSocket.on('error', (err: any) => {
        console.log(`Client to Proxy error: ${err?.message}`);
      });
    });
  };


//////////////////////////////////////
    //Error handler
    errorHandler = (err: any) => {
        console.log('[ERROR]', JSON.stringify(err));
      };
      
}

export default ProxyServer;
