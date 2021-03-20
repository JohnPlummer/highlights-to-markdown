document.addEventListener("DOMContentLoaded", function () {
  addButton();
});

function addButton() {
  const link = createDownloadLink();
  const header = document.querySelector("#titlebar > h1");
  header.parentNode.appendChild(link);
}

function createDownloadLink() {
  var anchor = document.createElement("a");
  anchor.innerText = "Download Highlights";
  anchor.onclick = download;
  anchor.href = "#";

  var div = document.createElement("div");
  div.appendChild(anchor);

  return div;
}

function download() {
  var link = document.createElement("a");
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
  var content = "# " + title() + "\n\n";
  content += "Article on [Instapaper](" + window.location.href + ")\n\n";

  highlights().forEach((h) => (content += "> " + h + "\n\n"));

  return content;
}

function highlights() {
  const spans = document.querySelectorAll("span.highlight");
  var id_map = new Map();
  spans.forEach(function (span) {
    id = span.getAttribute("data-api-id");
    if (id_map.has(id)) {
      id_map.set(id, id_map.get(id) + span.innerText);
    } else {
      id_map.set(id, span.innerText);
    }
  });

  return Array.from(id_map.values());
}
