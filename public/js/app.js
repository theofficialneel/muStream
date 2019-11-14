function playSong(element, title) {
  let main_div = element.parentElement.parentElement;
  let img_tag = main_div.firstChild.nextSibling;

  document.getElementById("thumbnail-big").src = img_tag.src;
  document.getElementById("song-name-big").innerHTML = title;
  // document.getElementById("album-name-big").innerHTML = main_div.getAttribute("album");
  // document.getElementById("artist-name-big").innerHTML = main_div.getAttribute("artist");

  let favorite_icon = element.nextSibling.nextSibling.firstChild.innerHTML;
  if(favorite_icon == "favorite"){
    document.getElementById("favorite-icon-big").innerHTML = "favorite";
    document.getElementById("now-playing-favorite").setAttribute("onclick", `remove_from_favorite(${song_id})`);
  } else {
    document.getElementById("favorite-icon-big").innerHTML = "favorite_border";
    document.getElementById("now-playing-favorite").setAttribute("onclick", `add_to_favorite(${song_id})`);
  }

  document.getElementById("now-playing-playlist").setAttribute("onclick", `add_to_playlist(${song_id})`);
  document.getElementById("audio-source").src = element.getAttribute("data");
  document.getElementById("play-controls").load();
  document.getElementById("play-controls").play();

  var song_id = element.id;
}

function add_to_playlist(id) {
  var playlist = window.prompt("Please enter Playlist Name");
  window.location.href = "/playlist/add/"+id+"/"+playlist;
  // $.ajax({
  //     type: "POST",
  //     url: '/playlist/add/'+id,
  //     data: {playlist: playlist},
  //     success: ()=>{console.log("sucess")}
  // });
}

function add_to_favorite(id) {
  window.location.href = "/users/favorites/add/"+id;
}