// script.js

// Initialize Cloudinary settings
const cloudinarySettings = {
    cloudName: "ds17rabva",
    uploadPreset: "ml_default",
    sources: ["local", "url", "camera"],
    resourceType: "video",
    maxFileSize: 100000000, // Maximum upload file size in bytes (100MB)
    maxImageWidth: 3840, // Maximum image width allowed in pixels
    maxImageHeight: 2160, // Maximum image height allowed in pixels
    maxVideoDuration: 60, // Maximum video duration allowed in seconds
    cropping: false, // Disable image cropping
    showSkipCropButton: false, // Hide the skip cropping button
    multiple: false, // Allow only single file upload
  };
  
  // Event listener for uploadContainer
  const uploadContainer = document.getElementById("uploadContainer");
  uploadContainer.addEventListener("click", handleFileUpload);
  
  // Handle file upload
  function handleFileUpload() {
    cloudinary.openUploadWidget(cloudinarySettings, function (error, result) {
      if (!error && result && result.event === "success") {
        const fileData = result.info;
        const fileName = prompt("Enter a file name:", fileData.original_filename);
        if (fileName !== null) {
          const videoUrl = fileData.secure_url;
          saveVideoData(fileName, videoUrl);
          displayRecentClips();
        }
      }
    });
  }
  
  // Save video data to local storage
  function saveVideoData(fileName, videoUrl) {
    const videoData = {
      name: fileName,
      url: videoUrl,
      createdAt: new Date().toISOString(),
    };
  
    let videos = localStorage.getItem("videos");
    if (!videos) {
      videos = [];
    } else {
      videos = JSON.parse(videos);
    }
  
    videos.push(videoData);
    localStorage.setItem("videos", JSON.stringify(videos));
  }
  
  // Display uploaded videos in recent clips section
  function displayRecentClips() {
    const recentClipContainer = document.getElementById("recentClipContainer");
    recentClipContainer.innerHTML = "";
  
    let videos = localStorage.getItem("videos");
    if (videos) {
      videos = JSON.parse(videos);
      videos.forEach(function (video) {
        const clipElement = createClipElement(video);
        recentClipContainer.appendChild(clipElement);
      });
    }
  }
  
  // Create clip element for displaying videos
  function createClipElement(video) {
    const clipElement = document.createElement("div");
    clipElement.classList.add("clip");
  
    const videoElement = document.createElement("video");
    videoElement.src = video.url;
    videoElement.controls = true;
  
    const titleElement = document.createElement("h3");
    titleElement.textContent = video.name;
  
    const createdAtElement = document.createElement("p");
    createdAtElement.textContent = "Created at: " + video.createdAt;
  
    const copyLinkButton = document.createElement("button");
    copyLinkButton.textContent = "Copy Link";
    copyLinkButton.addEventListener("click", function () {
      copyToClipboard(video.url);
    });
  
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      deleteVideo(video);
      displayRecentClips();
    });
  
    const infoElement = document.createElement("div");
    infoElement.classList.add("info");
    infoElement.appendChild(createdAtElement);
    infoElement.appendChild(copyLinkButton);
    infoElement.appendChild(deleteButton);
  
    clipElement.appendChild(videoElement);
    clipElement.appendChild(titleElement);
    clipElement.appendChild(infoElement);
  
    return clipElement;
  }
  
  // Copy video URL to clipboard
  function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Link copied to clipboard!");
  }

  // Display uploaded videos in recent clips section
   function displayRecentClips() {
    const recentClipContainer = document.getElementById("recentClipContainer");
    recentClipContainer.innerHTML = "";
  
    let videos = localStorage.getItem("videos");
    if (videos) {
      videos = JSON.parse(videos);
      videos.forEach(function (video) {
        const clipElement = createClipElement(video);
        recentClipContainer.appendChild(clipElement);
      });
    }
  
    // Show "No available video" message if there are no videos
    const noVideoMessage = document.getElementById("noVideoMessage");
    noVideoMessage.style.display = videos && videos.length > 0 ? "none" : "block";
  }
  
  // Delete video from local storage
  // Delete video from local storage
   function deleteVideo(video) {
    const confirmation = prompt("To confirm deletion, please enter 'delete':");
    if (confirmation === "delete") {
      let videos = localStorage.getItem("videos");
      if (videos) {
        videos = JSON.parse(videos);
        videos = videos.filter(function (item) {
          return item.url !== video.url;
        });
        localStorage.setItem("videos", JSON.stringify(videos));
      }
    }
  }
  
  
  // Initialize the recent clips on page load
  displayRecentClips();
  