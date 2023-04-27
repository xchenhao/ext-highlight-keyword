var keywordList = [];

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("addButton").addEventListener("click", addKeyword);
  loadKeywords()
});

function loadKeywords() {
  chrome.storage.sync.get("keywords", function (data) {
    if (data.keywords) {
      keywordList = data.keywords;
    }
    updateKeywordList()
  });
}

function saveKeywords() {
  chrome.storage.sync.set({keywords: keywordList});
}

function addKeyword() {
  var input = document.getElementById("keywordInput");
  var keyword = input.value.trim();
  if (keyword !== "") {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "addKeyword", keyword: keyword, tabId: tabs[0].id },
          function (response) {
            keywordList.push(keyword);
            updateKeywordList();
            saveKeywords();
            input.value = "";
          }
        );
    });
  }
}

function removeKeyword() {
  var index = parseInt(this.getAttribute("data-index"));
  var keyword = keywordList[index];

  chrome.tabs.query({ active: true, currentWindow: true },
    function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id,
        { action: "removeKeyword", keyword: keyword, tabId: tabs[0].id },
        function (response) {
          keywordList.splice(index, 1);
          updateKeywordList();
          saveKeywords();
        }
      );
    });
}

function updateKeywordList() {
  var list = document.getElementById("keywordList");
  list.innerHTML = "";
  for (var i = 0; i < keywordList.length; i++) {
    var item = document.createElement("li");
    item.textContent = keywordList[i];
    var removeButton = document.createElement("button");
    removeButton.textContent = "删除";
    removeButton.setAttribute("data-index", i);
    removeButton.addEventListener("click", removeKeyword);

    item.appendChild(removeButton);
    list.appendChild(item);
  }
}

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     sendResponse({msg: "Extension ACK"});
// });
