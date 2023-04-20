(function() {
    'use strict';
    console.log('reading js');
    const videos = document.querySelectorAll('#videos .video-wrapper');
    let backgroundVideo = document.querySelector('#background-video video');
    backgroundVideo.playbackRate = 0.8;
    let backgroundVideoSrcs = document.querySelectorAll('#background-video video source');
    let currentVideo = 'water';
    // let videosLoaded = false;
    // let longestVideo = document.getElementById('earth-video');
    // longestVideo.addEventListener('playing', () => {
    //     videosLoaded = true;
    // });
    let videoPage = document.getElementById('videos');
    // videoPage.style.display = 'none';
    let poemPage =  document.getElementById('poem');
    const line1 = document.querySelector('#line1');
    const line2 = document.querySelector('#line2');
    const line3 = document.querySelector('#line3');
    const poem = {
        width: [305, 457, 650],
        line: [line1, line2, line3],
        content: ['How rare', 'and beautiful it is', 'to even exist...']
    }
    let line = 0;

    let intervalNum = 0;
    let interval = setInterval(typeLine, 200);

    function typeLine() {
        intervalNum++;
        poem.line[line].textContent = poem.content[line].slice(0, intervalNum);
        if (intervalNum > poem.content[line].length) {
            intervalNum = 0;
            if (line < poem.line.length - 1) {
                poem.line[line].style.animation = '';
                poem.line[line].style.borderRight = 'none';
            }
            nextLine();
        }
    }

    function nextLine(){
        if (line < poem.line.length - 1) {
            poem.line[line].className = "hidden";
            line++;
            poem.line[line].className = 'showing';
        } else {
            clearInterval(interval);
            // console.log(videosLoaded)
            setTimeout(() => {
                poem.className = 'hidden';

                videoPage.style.display = 'flex';
                videoPage.className = 'showing';
                document.getElementById('background-video').className = 'showing';            
            }, 2000);
            
        }
    }
    

    

    
    console.log(backgroundVideoSrcs)
    videos.forEach((video) => {
        console.log(video);
        video.addEventListener('mouseover', () => {
            console.log(video.id, currentVideo);
            if (currentVideo != video.id) {
                currentVideo = video.id;
                backgroundVideo.style.opacity = 0.15;
                setTimeout(() => {
                    backgroundVideoSrcs.forEach((source) => {
                        source.src = `media/${currentVideo}.${source.type.slice(6)}`;
                    });
                    backgroundVideo.load();
                    backgroundVideo.style.opacity = 0.5;
                }, 500);
            }
        });
    });
})();