/*
 * Copyright © 2016 I.B.M. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* global WatsonSpeech: true, Api: true Common: true, STTModule: true */
/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^TTSModule$" }] */

var TTSModule = (function() {
  'use strict';
  var audio = null; //document.getElementById('tts-audio');
  var button = document.getElementById('speaker-image');
  button.value = button.getAttribute('value');
  var audio_setting = localStorage.getItem("audio_setting") || button.value;
  var browserTtsRequired = false;
  //Common.hide(button); // In case user is using invalid browsers

  return {
    init: init,
    toggle: toggle
  };

  function init() {
    textToSpeech();
    checkBrowsers();
    checkStoredSetting();
  }

  // Create a callback when a new Watson response is received to start speech
  function textToSpeech() {
    var currentResponsePayloadSetter = Api.setWatsonPayload;
    Api.setWatsonPayload = function(payload) {
      currentResponsePayloadSetter.call(Api, payload);
      playCurrentAudio(payload.output); // Plays audio using output speech or text
    };
  }

  // TTS only works in Chrome and Firefox
  function checkBrowsers() {
    //if ((navigator.getUserMedia || navigator.webkitGetUserMedia ||
    //  navigator.mozGetUserMedia || navigator.msGetUserMedia)) {
    //  Common.show(button); // Show button only if in valid browsers
    //}
    if (typeof speechSynthesis !== 'undefined') {
      if(speechSynthesis.onvoiceschanged === undefined) { // IOS
        browserTtsRequired = true;
      }
    }
  }

  function checkStoredSetting() {
    if(browserTtsRequired) {
      toggle();
      return;
    }
    
    if(audio_setting === 'ON' && button.value === 'OFF') {
      toggle();
    }
  }

  // Toggle TTS/Mute button
  function toggle() {
    if (button.value === 'OFF') {
      if(browserTtsRequired) {
        var msg = new SpeechSynthesisUtterance("Turning on text to speech");
        msg.lang = 'en-GB';          
        speechSynthesis.speak(msg);
      }
    
      button.value = 'ON';
      button.setAttribute('class', 'audio-on');
    }
    else {
      if (audio !== null && audio.playing)
        audio.pause(); // Pause the current audio if the toggle is turned OFF
        
      if(browserTtsRequired) {
        var msg = new SpeechSynthesisUtterance("Turning off text to speech");
        msg.lang = 'en-GB';          
        speechSynthesis.speak(msg);
      }
      
      button.value = 'OFF';
      button.setAttribute('class', 'audio-off');
    }

    button.setAttribute('value', button.value);
    localStorage.setItem("audio_setting", button.value);
  }

  // Stops the audio for an older message and plays audio for current message
  function playCurrentAudio(output) {
    fetch('/api/text-to-speech/token') // Retrieve TTS token
      .then(function(response) {
        return response.text();
      }).then(function(token) {
      if (button.value === 'ON' && ( typeof output.speech == 'undefined' || output.speech )) {
        // Takes text, voice, and token and returns speech

        if (output.text) { // If payload.text is defined

          // prefer the output speech, otherwise read the output text
          //TODO: handle multiple strings, some with speech, some with text.
          var voice_output = output.speech ? output.speech : output.text;

          // join array of strings into one string of sentences for correct voice output
          if(Array.isArray(voice_output)) voice_output = voice_output.join('. ');

          // Pauses the audio for older message if there is a more current message
          if (audio !== null && audio.playing()) {
            audio.pause();
          }
          //TODO: gracefully handle: Failed to load resource: the server responded with a status of 400 (Bad Request)
          if(browserTtsRequired) {
            var msg = new SpeechSynthesisUtterance(voice_output);
            msg.lang = 'en-GB';            
            speechSynthesis.speak(msg);
            
            msg.onend = function(event) {
              allowSTT(output, voice_output); // Check if user wants to use STT
            };
          }
          else {
            var audioSource = WatsonSpeech.TextToSpeech.synthesize({
              text: voice_output, // Output text/response
              voice: 'en-US_MichaelVoice', // Default Watson voice
              autoPlay: false, // Automatically plays audio
              accept: 'audio/wav',
              urlOnly: true,
              token: token
            });
  
            audio = new Howl({
              src: [audioSource],
              format: ['wav'],
              autoplay: true,
              onend: function() {
                allowSTT(output, voice_output); // Check if user wants to use STT
              }
            });
          }

          // When the audio stops playing
          //audio.onended = function() {
          //  allowSTT(output, voice_output); // Check if user wants to use STT
          //};
        } else {
          // Pauses the audio for older message if there is a more current message
          if (audio !== null && audio.playing()) {
            audio.pause();
          }
          // When payload.text is undefined
          allowSTT(output); // Check if user wants to use STT
        }
      } else { // When TTS is muted
        allowSTT(output); // Check if user wants to use STT
      }
    });
  }

  // Check for conditions to allow user to use STT input
  function allowSTT(payload, voice_output) {

    if (payload.ref === 'STT' ||        // IF user toggled microhpone button, always activate STT
        button.value === 'ON' &&        // IF audio control button is switched ON, then check:
        (mic_setting === 'always' ||      // if mic_setting is 'always', activate STT
                                          // if mic_setting is 'prompt', check for autoMic setting or question mark
         mic_setting === 'prompt' && (payload.autoMic || voice_output && voice_output[voice_output.length-1]==='?'))) {

      //STTModule.speechToText();
      toggleRecognition();
    }
  }
})();
TTSModule.init(); // Runs Text to Speech Module