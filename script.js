const songs = [
  [ "'Cause You Have To", "LANY", 209, "'Cause You Have To.mp3"]
  ];

const $ = (id) => document.querySelector(id);

const title = $("#title");
const artist = $("#artist");
const link = $("#link");
const bar = $("#progress");
const now = $("#now");
const left = $("#left");
const status = $("#status");
const vinyl = $("#vinyl");
const list = $("#list");
const play = $("#play");

const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;

const formatTime = (seconds) => {
  if (isNaN(seconds)) return "0.00";
  const minutes = Math.floor(seconds / 60);
  
