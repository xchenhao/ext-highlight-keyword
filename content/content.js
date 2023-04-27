var keywords = [];

function highlight(keyword) {
  var body = document.getElementsByTagName("body")[0];
  var textNodes = getTextNodes(body);
  for (var i = 0; i < textNodes.length; i++) {
    var node = textNodes[i];
    highlightKeyword(node, keyword)
  }
}

function unHighLight(keyword) {
  var words = document.getElementsByClassName('ch-keyword')
  for (let i = 0; i < words.length; i++) {
    if (words[i].firstChild.nodeValue === keyword && words[i].classList.contains('ch-highlight')) {
      words[i].classList.remove('ch-highlight')
    }
  }
}

function getTextNodes(node) {
  var textNodes = [];
  if (node.nodeType === Node.TEXT_NODE) {
    textNodes.push(node);
  } else {
    var children = node.childNodes;
    for (var i = 0; i < children.length; i++) {
      textNodes = textNodes.concat(getTextNodes(children[i]));
    }
  }
  return textNodes;
}

function highlightKeyword(node, keyword) {
  var searchStr = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // var regex = new RegExp('\\b' + searchStr + '\\b', 'gi');
  var regex = new RegExp(searchStr, 'gi');
  if (node.nodeType === Node.TEXT_NODE) {
    if (node.classList && node.classList.contains('ch-keyword')) {
      if (!node.classList.contains('ch-highlight')) {
        node.classList.add('ch-highlight')
      }
    } else if (node.parentNode) {
      node.parentNode.innerHTML = node.parentNode.innerHTML.replace(
        regex,
        '<span class="ch-highlight ch-keyword">' + keyword +'</span>'
      )
    }

  } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== "SCRIPT" && node.tagName !== "STYLE") {
    const children = node.childNodes;
    for (let j = 0; j < children.length; j++) {
      highlightKeyword(children[j], keyword);
    }
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
      case "addKeyword":
        if (!keywords.includes(request.keyword)) {
          keywords.push(request.keyword)
          highlight(request.keyword);
        }
        break
      case "removeKeyword":
        if (keywords.includes(request.keyword)) {
          for (let i = 0; i < keywords.length; i++) {
            if (keywords[i] === request.keyword) {
              keywords.splice(i, 1)
              break
            }
          }
          unHighLight(request.keyword)
        }
        break
    }
    // sendResponse({msg: "Web ACK"});
  });
