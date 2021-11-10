// const Peer = require("peerjs");

var editor1 = ace.edit("editor");
editor1.setTheme("ace/theme/monokai");
editor1.session.setMode("ace/mode/c_cpp");

var inputeditor1 = ace.edit("inputeditor");
inputeditor1.setTheme("ace/theme/monokai");
inputeditor1.session.setMode("ace/mode/c_cpp");

var outputeditor1 = ace.edit("outputeditor");
outputeditor1.setTheme("ace/theme/monokai");
outputeditor1.session.setMode("ace/mode/c_cpp");

outputeditor1.setReadOnly(true);
var socket = io("http://localhost:3000", {
    transports: ["websocket", "polling", "flashsocket"],
});

const editor = document.getElementById("editor"),
    editorDiv = document.querySelector(".editor"),
    ioo = document.querySelector(".io"),
    inputeditor = document.getElementById("inputeditor"),
    outputeditor = document.getElementById("outputeditor"),
    fontList = document.getElementById("fontsize"),
    languageList = document.getElementById("language"),
    themeList = document.getElementById("theme"),
    loader = document.querySelector(".loader"),
    loader2 = document.querySelector(".loader2"),
    saveButton = document.querySelector(".save"),
    audioJoinButton = document.querySelector(".join"),
    splitpane = document.querySelector(".splitpane"),
    profile1 = document.querySelector(".profile1"),
    profile2 = document.querySelector(".profile2"),
    profile1svg = document.querySelector(".profile1svg"),
    profile2svg = document.querySelector(".profile2svg");

const languageInEditor = {
    cpp: "c_cpp",
    c: "c_cpp",
    python: "python",
    python3: "python",
    java: "java",
    javascript: "javascript",
    kotlin: "kotlin",
};

for (const [inPaiza, inEditor] of Object.entries(languageInEditor)) {
    let curElem = document.createElement("option");
    curElem.value = inPaiza;
    curElem.id = inPaiza;
    curElem.innerText = inPaiza;
    languageList.appendChild(curElem);
}

const fontSizes = [20, 22, 24, 26, 28, 30, 32, 34];
fontSizes.forEach((curFontSize) => {
    let curElem = document.createElement("option");
    curElem.value = curFontSize;
    curElem.innerText = curFontSize;
    fontList.appendChild(curElem);
});
outputeditor1.clearSelection();

const themes = [
    "monokai",
    "github",
    "solarized_dark",
    "dracula",
    "eclipse",
    "tomorrow_night",
    "tomorrow_night_blue",
    "xcode",
    "ambiance",
    "solarized_light",
];

themes.forEach((curTheme) => {
    let curElem = document.createElement("option");
    curElem.value = curTheme;
    curElem.innerText = curTheme;
    themeList.appendChild(curElem);
});

let languageSelected = "cpp";

function handleLanguageSelection(e) {
    editor1.session.setMode(`ace/mode/${languageInEditor[e]}`);
    languageSelected = e;
    // send language settings to backend
    socket.emit("selectedLanguage", languageList.selectedIndex);
}

function handleFontSelection(e) {
    editor.style.fontSize = e + "px";
    inputeditor.style.fontSize = e + "px";
    outputeditor.style.fontSize = e + "px";
}

function handleThemeSelection(e) {
    editor1.setTheme(`ace/theme/${e}`);
    inputeditor1.setTheme(`ace/theme/${e}`);
    outputeditor1.setTheme(`ace/theme/${e}`);
}

function handleCopytoClipboard() {
    navigator.clipboard.writeText(editor1.getValue());
    alert("Code copied to clipboard");
}

function handleSaveAndRun() {
    // send details for the save and run button to server
    socket.emit("runStart");
    saveButton.style.display = "none";
    loader.style.display = "block";
    outputeditor1.setValue("");
    runner();
}

function handleAudioJoining() {
    audioJoinButton.style.display = "none";
    loader2.style.display = "block";
    setTimeout(function () {
        audioJoinButton.style.display = "block";
        loader2.style.display = "none";
        if (audioJoinButton.innerText === "Join Audio")
            audioJoinButton.innerText = "Disconnect Audio";
        else audioJoinButton.innerText = "Join Audio";
    }, 1000);
}

let splitpaneMouseDown = false;
splitpane.addEventListener("mousedown", () => {
    splitpaneMouseDown = true;
    document.body.addEventListener("mousemove", movingMouse);
    document.body.addEventListener("mouseup", upMouse);
});

function movingMouse(e) {
    if (splitpaneMouseDown === true) {
        const totalWidth = window.innerWidth;
        const onePercentOfTotalWidth = totalWidth / 100;
        const internalOnePercent =
            (totalWidth - 2 * onePercentOfTotalWidth) / 100;
        const widthWillBe =
            e.clientX - onePercentOfTotalWidth - internalOnePercent / 2;
        const otherWidth =
            totalWidth -
            widthWillBe -
            2 * onePercentOfTotalWidth -
            2 * internalOnePercent;
        if (widthWillBe <= 100 || otherWidth <= 100) return;
        editorDiv.style.width = widthWillBe + "px";
        ioo.style.width = otherWidth + "px";

        // send span details to server
        socket.emit("span-details", {
            leftWidth: widthWillBe,
            rightWidth: otherWidth,
        });
    } else upMouse();
}

function upMouse() {
    splitpaneMouseDown = false;
    document.body.removeEventListener("mouseup", upMouse);
    document.body.removeEventListener("mousemove", movingMouse);
}

const runner = async () => {
    var runnerid = "";
    await fetch(
        "https://api.paiza.io/runners/create?" +
            new URLSearchParams({
                source_code: editor1.getValue(),
                language: languageSelected,
                input: inputeditor1.getValue(),
                longpoll: "true",
                api_key: "guest",
            }),
        { method: "POST" }
    )
        .then((response) => response.json())
        .then((json) => {
            runnerid = json.id;
        });

    var flag = true;
    while (flag) {
        await fetch(
            "https://api.paiza.io/runners/get_status?" +
                new URLSearchParams({
                    id: runnerid,
                    api_key: "guest",
                }),
            { method: "GET" }
        )
            .then((response) => response.json())
            .then((json) => {
                flag = json.status !== "completed";
            });
    }

    await fetch(
        "https://api.paiza.io/runners/get_details?" +
            new URLSearchParams({
                id: runnerid,
                api_key: "guest",
            }),
        { method: "GET" }
    )
        .then((response) => response.json())
        .then((json) => {
            var output = "";
            if (json.stdout !== null && json.stdout !== "") {
                output += json.stdout;
            }
            if (json.stderr !== null && json.stderr !== "") {
                output += json.stderr;
            }
            if (json.build_stderr !== null && json.build_stderr !== "") {
                output += json.build_stderr;
            }
            outputeditor1.setValue(output, 1);
            saveButton.style.display = "block";
            loader.style.display = "none";
            socket.emit("runEnded", output);
        });
};

// #include<iostream>
// using namespace std;

// int main(){
//     int n; cin >> n;
//     for(int i = 0; i < n; i++) {
//         cout << i << endl;
//     }
// }

/// socket work

// sending output field changes to server
editor.addEventListener("keyup", (e) => {
    socket.emit("code", editor1.getValue());
});

// sending input field changes to server
inputeditor.addEventListener("keyup", (e) => {
    socket.emit("inputtext", inputeditor1.getValue());
});

// changing editor field for other users
socket.on("code", (code) => {
    editor1.setValue(code);
    editor1.clearSelection();
});

// changing input field for other users
socket.on("inputtext", (text) => {
    inputeditor1.setValue(text);
    inputeditor1.clearSelection();
});

// changing span position for other users
socket.on("span-details", ({ leftWidth, rightWidth }) => {
    editorDiv.style.width = leftWidth + "px";
    ioo.style.width = rightWidth + "px";
});

// changing styles for save and run button to "running"
socket.on("runStart", () => {
    saveButton.style.display = "none";
    loader.style.display = "block";
    outputeditor1.setValue("");
});

// changing styles for save and run button to "complete"
socket.on("runEnded", (output) => {
    outputeditor1.setValue(output, 1);
    saveButton.style.display = "block";
    loader.style.display = "none";
});

// changing selected language for other users
socket.on("selectedLanguage", (selectedLanguageIndex) => {
    languageList.selectedIndex = selectedLanguageIndex;
    const language = languageList.value;
    editor1.session.setMode(`ace/mode/${languageInEditor[language]}`);
    languageSelected = language;
});

// Another user has joined the room
socket.on("userJoinedRoom", (userName) => {
    console.log(`${userName} has joined the editor`);
});

// A user has left the room
socket.on("userLeavedRoom", (userName) => {
    console.log(`${userName} has left editor`);
});

const roomId = prompt("Enter room id");
socket.emit("joinRoom", { userName: "Tanishq", roomId });

// const myPeer = new Peer();
// const myVideo = document.getElementById("local-video"),
//     otherVideo = document.getElementById("remote-video");

// myVideo.muted = true;

// navigator.mediaDevices
//     .getUserMedia({
//         video: true,
//         audio: true,
//     })
//     .then((stream) => {
//         addVideoStream(myVideo, stream);
//         myPeer.on("call", (call) => {
//             call.answer(stream);
//             call.on("stream", (userVideoStream) => {
//                 addVideoStream(otherVideo, userVideoStream);
//             });
//         });
//         socket.on("userJoinedRoom",)
//     });

// function addVideoStream(video, stream) {
//     video.srcObject = stream;
//     video.addEventListener("loadedmetadata", () => {
//         video.play();
//     });
// }
