document.addEventListener("DOMContentLoaded", function () {
  addButton();
});

function addButton() {
  const link = createDownloadLink();
  const header = document.querySelector("#titlebar > h1");
  header.parentNode.appendChild(link);
}

function createDownloadLink() {
  let anchor = document.createElement("a");
  anchor.innerText = "Download Highlights";
  anchor.onclick = download;
  anchor.href = "#";

  let div = document.createElement("div");
  div.appendChild(anchor);

  return div;
}

function download() {
  let link = document.createElement("a");
  link.download = filename();
  link.href = createHref();
  link.click();
  return false;
}

function filename() {
  const safeTitle = title()
    .replace(/[^a-z0-9_\-]/gi, "_")
    .toLowerCase();
  return safeTitle + "_highlights.md";
}

function title() {
  return document.querySelector("title").innerText;
}

function createHref() {
  const encodedContent = encodeURIComponent(content());
  return "data:text/markdown;charset=utf-8," + encodedContent;
}

function content() {
  let content = "# " + title() + "\n\n";
  content += "Article on [Instapaper](" + window.location.href + ")\n\n";
  content += annotations().join("\n\n");

  return content;
}

function annotations() {
  const highlights = getHighlights();
  const notes = getNotes();

  let array = new Array();
  highlights.forEach(function (highlight, rel) {
    array.push(highlight.get("content"));
    console.log(highlight.get("content"));
    if (notes.has(rel)) {
      array.push("> " + notes.get(rel));
      console.log(notes.get(rel));
    }
  });
  return array;
}

function getHighlights() {
  const spans = document.querySelectorAll("span.highlight");
  let map = new Map();

  spans.forEach(function (span) {
    const rel = span.getAttribute("rel");
    const id = span.getAttribute("data-api-id");
    const text = span.innerText;
    if (map.has(rel)) {
      let content = map.get(rel).get("content");
      map.get(rel).set("content", content + text);
    } else {
      map.set(
        rel,
        new Map([
          ["id", id],
          ["content", text],
        ])
      );
    }
  });

  return map;
}

function getNotes() {
  const spans = document.querySelectorAll("span.ipnote");
  let map = new Map();

  spans.forEach(function (span) {
    const rel = span.getAttribute("rel");
    const text = span.getAttribute("data-comment");
    if (map.has(rel)) {
      let content = map.get(rel);
      map.set(rel, content + text);
    } else {
      map.set(rel, text);
    }
  });

  return map;
}
