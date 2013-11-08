function WakeWindow(){
  this.screenWidth = screen.availWidth;
  this.screenHeight = screen.availHeight;
  this.width = Math.floor(this.screenWidth/4);
  this.height = Math.floor(this.screenHeight*(4/5));
  
  this.winOpts = {
    
    frame: 'none',
    minWidth: this.width,
    minHeight: this.height,
    maxWidth: this.screenWidth,
    maxHeight: this.screenHeight,
    transparentBackground: true,
    
    bounds: {
      
      width: this.width,
      height: this.height,
      left: Math.floor((this.screenWidth - this.width)/2),
      top: Math.floor((this.screenHeight - this.height)/2)
      
    }
    
  }
  
  this.win = chrome.app.window.create('index.html', this.winOpts);
  
  return {
    "opts": this.winOpts,
    "win": this.win
  };
  
}

chrome.app.runtime.onLaunched.addListener(function() {
  
  var w = new WakeWindow();
  
  if (w.opts.transparentBackground === undefined) {
    
    var opt = {
      
      type: "basic",
      title: "Please enable the experimental APIs flag",
      message: "There's a little roadblock to the ability to create transparent Aura/Ash windows that you're probably experiencing. Unless you enable the experimental APIs flag, your window won't be transparent, and that's because there are some apps Google knows about that have to work on Aura-less systems. Not this one, which will uninstall itself if installed on something other than a Chromebook...",
      iconUrl: "icon_128.png"
      
    }
    
    chrome.notifications.create('extapis', opt, function(id) {
      
      id = "extapis";
      console.log("Notification to enable chrome.experimental flag sent to user");
      
    });
    
  }
  
});


function isCrOS() {
  
  chrome.runtime.getPlatformInfo(function(info) {
    
    if (info.os != 'cros') {
      
      var opt = {
        
        type: "basic",
        title: "Not a Chromebook!",
        message: "You are using a computing device that isn't a Chromebook. Only devices running Chrome OS support the chrome.power API, rendering this app useless on your computer",
        iconUrl: "icon_128.png"
        
      }
      
      chrome.notifications.create('notcros', opt, function(id) {
        
        id = "notcros";
        console.log('Unsupported OS warning sent to user');
        
      });
      
    } else {
      
      //do nothing
      
    }
    
  });
  
}
    

function notify() {
  
  var manifest = chrome.runtime.getManifest();
  this.version = parseFloat(manifest.version);
  
  chrome.runtime.onInstalled.addListener(function(details) {
    
    isCrOS();
    
    var opt = {
    
      type: "basic",
      title: "Please update your review",
      message: "\"Wake Up!\" has been updated. If you have a negative review in the Chrome Web Store and it's of the previous version, we ask that you please update it to reflect the changes in the latest version. Thanks.",
      iconUrl: "icon_128.png"
    
    }
    
    if (details.reason == "update") {
      
      chrome.notifications.create('wakeupdate', opt, function(id) {
        
        id = "wakeupdate";
        console.log('Notification to update review sent to user');
        
      });
      
    } else {
      
      //do nothing
      
    }
    
  });

  chrome.notifications.onClicked.addListener(function(id) {
    
    if (id == "wakeupdate") {
      
      var w = window.open();
      w.location = "https://chrome.google.com/webstore/detail/" + chrome.runtime.id + "/details";
      
    } else if (id == "systemPowKeptAwake") {
      
      var screenWidth = screen.availWidth;
      var screenHeight = screen.availHeight;
      var width = Math.floor(screenWidth/4);
      var height = Math.floor(screenHeight*(4/5));
  
      chrome.app.window.create('index.html', {
        frame: 'none',
        minWidth: width,
        minHeight: height,
        transparentBackground: true,
        bounds: {
          width: width,
          height: height,
          left: Math.floor((screenWidth-width)/2),
          top: Math.floor((screenHeight-height)/2)
        }
      });
      
    } else if (id == "displayPowKeptAwake") {
      
      var screenWidth = screen.availWidth;
      var screenHeight = screen.availHeight;
      var width = Math.floor(screenWidth/4);
      var height = Math.floor(screenHeight*(4/5));
  
      chrome.app.window.create('index.html', {
        frame: 'none',
        minWidth: width,
        minHeight: height,
        transparentBackground: true,
        bounds: {
          width: width,
          height: height,
          left: Math.floor((screenWidth-width)/2),
          top: Math.floor((screenHeight-height)/2)
        }
      });
      
    } else if (id == 'notcros') {
      
      chrome.management.uninstallSelf();
      
    } else if (id == 'experimental_apis') {
      
      window.open().location = 'chrome://flags/#extension_apis';
      
    } else {
      
      //do nothing
    }
    
  });
  
  chrome.notifications.onClosed.addListener(function(id, always) {
    
    always = true||false;
    
    if (id == "wakeupdate") {
      
      var w = window.open();
      w.location = "https://chrome.google.com/webstore/detail/" + chrome.runtime.id + "/details";
      
    } else if (id == 'notcros') {
      
      chrome.management.uninstallSelf();
      
    } else if (id == 'experimental_apis') {
      
      window.open().location = 'chrome://flags/#extension_apis';
      
    } else {
      
      //do nothing
    }
    
  });
  
}

function listen() {
  
  chrome.runtime.requestUpdateCheck(function(uaStatus, details) {
    
    if (uaStatus == 'update_available') {
      
      chrome.runtime.reload();
      
    } else {
      
      //do nothing
      
    }
    
  });
  
}

setInterval(function() { listen(); }, 5000);

notify();
