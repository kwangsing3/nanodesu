<template>
<section>
  <webview id="gameview" class="gameview" src="https://www.youtube.com/"/>
  <div>
    <input class="navigator-url" id="urlbar"
      type="text"
      placeholder="輸入網址:"
      value=""
      />
    <button class="navigator-button"
      @click="sendurls()"> 
      <i class="arrow right"/> 
    </button>
    <button class="navigator-button"
      @click="sendurls('https://www.google.com/')"> 
      <i class="arrow right"/> 
    </button>
  </div>
</section>
</template>



<script lang="ts">
import { WebviewTag } from 'electron';
import { Options, Vue } from 'vue-class-component';
@Options({
  props: {
    msg: String
  },
  methods: {
    //redirect website
    sendurls(inputurl: string) {
      const urlbar = document.querySelector('input');
      const url = inputurl?inputurl:urlbar?.value;
      console.log(`轉入網頁: ${url}`);
      if(!url||!url.startsWith('http')){
        return
      }
      const webview: WebviewTag|null = document.querySelector('webview');
      webview?.loadURL(url);
    },
  },
  computed:{
    
  },
  data() {
    return{
      //targetURL:'https://www.google.com/',
    }
  },
  mounted: OnInit

})
export default class GameView extends Vue {}


function OnInit(){
  const webview: WebviewTag|null = document.querySelector('webview');
  
  //listening and display webview address
  webview?.addEventListener('did-stop-loading',()=>{
    const strURL = webview.getURL();
    const urlbar = document.querySelector('input');
    if(urlbar){
      urlbar.value = strURL
    }
  })
}




//http://www.dmm.com/netgame/social/-/gadgets/=/app_id=854854/
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.gameview {
  min-height: 720px;
}

.navigator-url{
  width: 400px;
  height: 25px;
  font-size: 18px;
}
.navigator-button{
  background-color: #ffffff; /* Green */
  margin-left: 3px;
  color: rgb(0, 0, 0);
  padding: 8px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 20%;
  border: 2px solid #0479c7; /* Green */
}
.arrow {
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(-45deg);
}
</style>
