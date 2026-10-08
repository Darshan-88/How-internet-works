const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

const traceData = [
  ["01 / YOUR DEVICE", "Your browser starts the journey.", "The browser needs to turn a human-friendly domain into a destination and send a request across the network."],
  ["02 / WI-FI ROUTER", "Your local network receives the packet.", "Your device sends traffic through your local router, which connects the device to the wider network."],
  ["03 / DNS", "A name becomes a destination.", "DNS helps translate a domain such as example.com into an IP address that networked machines can use."],
  ["04 / ISP", "Your internet provider is the gateway.", "The ISP connects your local network to other networks and participates in routing traffic outward."],
  ["05 / INTERNET", "Routers move the packet between networks.", "The packet can cross multiple independent networks. Routing decisions determine where it goes next."],
  ["06 / SERVER", "The destination receives the request.", "A server processes the request and prepares a response, often involving databases, APIs or cached content."],
  ["07 / BACK TO YOU", "The response travels back.", "Your browser receives the response, assembles the resources and renders the webpage you see."]
];

function activateTrace(index) {
  const nodes = $$(".trace-node");
  nodes.forEach((n, i) => n.classList.toggle("active", i === index));
  const [label, title, body] = traceData[index];
  $("#traceExplainer").innerHTML = `<span>${label}</span><h3>${title}</h3><p>${body}</p>`;
}

function runTrace() {
  const packet = $("#packet");
  packet.classList.remove("run");
  void packet.offsetWidth;
  packet.classList.add("run");
  let i = 0;
  activateTrace(0);
  const timer = setInterval(() => {
    i++;
    if (i < traceData.length) activateTrace(i);
    else clearInterval(timer);
  }, 600);
}

$("#traceButton").addEventListener("click", runTrace);
$$(".trace-node").forEach(node => node.addEventListener("click", () => activateTrace(Number(node.dataset.step))));

function dnsLookup() {
  const input = $("#dnsInput").value.trim() || "example.com";
  $("#dnsDomain").textContent = input;
  const known = {
    "example.com": "93.184.216.34",
    "openai.com": "illustrative",
    "github.com": "illustrative",
    "google.com": "illustrative"
  };
  $("#dnsResult").textContent = known[input.toLowerCase()] || "93.184.216.34";
}
$("#dnsLookup").addEventListener("click", dnsLookup);
$("#dnsInput").addEventListener("keydown", e => { if (e.key === "Enter") dnsLookup(); });

function rotateEncryption() {
  const bytes = Array.from({length: 8}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0").toUpperCase());
  $("#encryptedText").textContent = bytes.join(" ") + " ...";
}
$("#encryptButton").addEventListener("click", rotateEncryption);

$("#cableButton").addEventListener("click", () => {
  $$(".sub-packet").forEach((p, i) => {
    p.style.animation = "none";
    void p.offsetWidth;
    p.style.animation = `${3 + i * .6}s cableMove linear infinite`;
  });
});

const infraButtons = $$(".infra");
let budget = 100;
let spent = 0;
let coverage = 20;
let reliability = 30;
let latency = 82;
const selected = [];

function updateSim() {
  $("#budget").textContent = `$${budget}M`;
  $("#spent").textContent = `$${spent}M`;
  $("#coverage").textContent = `${Math.min(100, coverage)}%`;
  $("#reliability").textContent = `${Math.min(100, reliability)}%`;
  $("#latency").textContent = `${Math.max(18, latency)}ms`;
  $("#budgetMeter").style.width = `${spent}%`;
  $("#selectionList").innerHTML = selected.length
    ? selected.map(x => `<div class="selection-item">${x.name} · $${x.cost}M</div>`).join("")
    : `<div class="selection-item">Choose infrastructure to build your network.</div>`;
}

infraButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const cost = Number(btn.dataset.cost);
    if (btn.classList.contains("selected")) return;
    if (budget < cost) {
      btn.animate([{transform:"translateX(0)"},{transform:"translateX(-5px)"},{transform:"translateX(5px)"},{transform:"translateX(0)"}], {duration:250});
      return;
    }
    btn.classList.add("selected");
    budget -= cost;
    spent += cost;
    coverage += Number(btn.dataset.coverage);
    reliability += Number(btn.dataset.reliability);
    latency += Number(btn.dataset.latency);
    selected.push({name: btn.dataset.name, cost});
    updateSim();
  });
});

$("#resetSim").addEventListener("click", () => {
  budget = 100; spent = 0; coverage = 20; reliability = 30; latency = 82;
  selected.length = 0;
  infraButtons.forEach(b => b.classList.remove("selected"));
  updateSim();
});

$$("[data-scroll]").forEach(btn => btn.addEventListener("click", () => {
  const target = $(btn.dataset.scroll);
  if (target) target.scrollIntoView({behavior:"smooth"});
}));

$("#menuButton").addEventListener("click", () => $("#mobileNav").classList.toggle("open"));
$$(".mobile-nav a").forEach(a => a.addEventListener("click", () => $("#mobileNav").classList.remove("open")));

window.addEventListener("scroll", () => {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  $("#progressBar").style.width = `${max ? (window.scrollY / max) * 100 : 0}%`;
});

updateSim();
activateTrace(0);
