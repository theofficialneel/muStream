// // displays songs in the list-display div
// function render_songs(songs, isPlaylist = false, isFav = false) {
//   let songs_div = document.getElementById("songs-display");
//   // remove the contents of the div
//   while (songs_div.firstChild) {
//     songs_div.removeChild(songs_div.firstChild);
//   }

//   // generate new content for list of songs
//   for (i = 0; i < songs.length; i++) {
//     let item = document.createElement("div");
//     item.className = "item";
//     let thumbnail_small = document.createElement("img");
//     thumbnail_small.className = "thumbnail-small";
//     thumbnail_small.src = songs[i].image;
//     let songname = document.createElement("span");
//     songname.className = "songname";
//     songname.textContent = songs[i].title;
//     let iconoptions = document.createElement("ul");
//     iconoptions.className = "iconoptions";

 
//     let playButton = document.createElement("li");
//     playButton.className = "button-big play";
//     playButton.id = songs[i].id; /*imp*/
//     playButton.setAttribute("onClick", "playSong(this)");
//     let playIcon = document.createElement("i");
//     playIcon.className = "material-icons";
//     playIcon.innerHTML = "play_circle_outline";
    

//     let playListButton;
//     let playListIcon = document.createElement("i"); //playlist icon has already declared
//     playListIcon.className = "material-icons";
//     playListIcon.innerHTML = "playlist_add";
//     if (!isPlaylist) {
//       // isPlaylist is set to True if "remove from favorites" button is needed
//       playListButton = document.createElement("li");
//       playListButton.className = "button-big addQueue";
//       modal = document.getElementById("song-modal");
//       playListButton.onclick = function() {
//         modal.style.display = "block";
//         render_modal(songname.textContent);
//       };
//     }

//     let favouriteButton;
//     let favouriteIcon = document.createElement("i");
//     favouriteIcon.className = "material-icons";
//     if(songs[i].is_favorite) {
//       favouriteIcon.innerHTML = "favorite";
//     }else {
//       favouriteIcon.innerHTML = "favorite_border";
//     }
//     if(!isFav)
//     {
//       favouriteButton = document.createElement("li");
//       favouriteButton.className = "button-big fav"; 
//       favouriteButton.onclick = function() {
//         let index = parseInt(playButton.id, 10);
//         add_to_favorites(index);
//         songs = get_songs();
//         songs[index].is_favorite = true;
//         library = get_library();
//         library["songs"] = songs;
//         set_library(library);
//       };
//     }

//     document.querySelector(".songs").appendChild(item);
//     document.getElementsByClassName("item")[i].appendChild(thumbnail_small);
//     document.getElementsByClassName("item")[i].appendChild(songname);
//     document.getElementsByClassName("item")[i].appendChild(iconoptions);

//     document.getElementsByClassName("iconoptions")[i].appendChild(playButton);
//     if (!isPlaylist) {
//       document.getElementsByClassName("iconoptions")[i].appendChild(playListButton);
//     }
//     if(!isFav)
//     {
//       document.getElementsByClassName("iconoptions")[i].appendChild(favouriteButton);
//     }
    
//     document.getElementsByClassName("button-big play")[i].appendChild(playIcon); 
//     if (!isPlaylist)
//     {
//       document.getElementsByClassName("button-big addQueue")[i].appendChild(playListIcon);
//     }
//     if (!isFav)
//     {
//       document.getElementsByClassName("button-big fav")[i].appendChild(favouriteIcon);
//     }
    
//   }
// }