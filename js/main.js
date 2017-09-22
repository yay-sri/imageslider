class RedditImages {
  constructor(){
    this.url = "https://api.reddit.com/r/pics/hot";
    this.images = [];
    this.currId = 1;
  }
  setCurrId (id) {
    this.currId = id;
  }
  getCurrId() {
    return this.currId;
  }
  getImages(){
    return this.images;
  }
  updateImages(){
    //load the first image and add the other image tags with data-src with link not src... onload of first image we make the data-src to src...that way they start loading in the background even before they are clicked
    let img = $('<img>');
    img.attr({
      "class":"imgshow",
      "id" : "img1",
      "src" : this.images[0]
    });
    img.appendTo('#imagediv');
    $("#img1").on("load",loadOtherImages);
    for(let ctr = 1; ctr < this.images.length; ctr++){
      let imgHolder = $('<img>');
      imgHolder.attr({
        "class" : "imgshow imghide",
        "id" : "img"+(ctr+1),
        "data-src": this.images[ctr]
      })
      imgHolder.appendTo('#imagediv');
    }
  }
  getJSONData() {
    $.get({
      url: this.url,
      success: data => {
        let imgList = data.data.children || [];
        imgList = imgList.filter(filterImages);
        imgList = imgList.slice(1,6);
        this.images = imgList.reduce((imgs, obj) => {
          imgs.push(obj.data.url);
          return imgs;
        },[]);
      }
    })
    .done((e) => {
      // update the view: we have the 5 images in images now... we need to show one and
      // download the rest in the background
      this.updateImages();
    })
    .fail(() => {
      //handle failure here
      console.log("api call failed");
    })
  }
}
function filterImages(obj) {
  return !obj.data.domain.includes("self.pics");
}

function loadOtherImages(){
  for(let ctr = 2; ctr <=5;ctr++){
    //once you assign src is when img starts loading
    $("#img"+ctr).attr("src",
      $("#img"+ctr).attr('data-src')
    );
  }
}
$('button').click(
  (e) => {
    let showId = 1;
    let currId = redditInstance.getCurrId();
    if(e.target.id == "slideleft") {
      showId = (currId > 1) ? (currId - 1): 5;
    } else if (e.target.id == "slideright") {
      showId = (currId < 5) ? (currId + 1): 1;
    }
    $("#img"+currId).hide();
    $("#img"+showId).show();
    redditInstance.setCurrId(showId);
  }
);
const redditInstance = new RedditImages();
redditInstance.getJSONData();
