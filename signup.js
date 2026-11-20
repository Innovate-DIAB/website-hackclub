// ===== WHERE SIGN-UPS ARE SENT =====
// This is the Google Apps Script web app that saves each sign-up as a row
// in the club's Google Sheet. See google-apps-script/README.md.
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzcsWfopRj2zq0D1zkZY-B29iIn9y2PdtnCGRsO0ceVA3xaPLJe6bKsp47rjuJBdMEZ/exec";

const form = document.getElementById("signupForm");
const submitBtn = document.getElementById("submitBtn");
const formError = document.getElementById("formError");
const interestsError = document.getElementById("interestsError");
const done = document.getElementById("signupDone");

// ===== MEETING TIME IN THE VISITOR'S OWN TIME ZONE =====
// 4:00 PM in Dubai (GMT+4) on 27 Nov 2026 is 12:00 UTC.
const meeting = new Date(Date.UTC(2026, 10, 27, 12, 0));
const myZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
if (myZone && myZone !== "Asia/Dubai" && myZone !== "Asia/Muscat") {
    const local = meeting.toLocaleString(undefined, {
        weekday: "long", day: "numeric", month: "long",
        hour: "numeric", minute: "2-digit", timeZoneName: "short"
    });
    document.getElementById("localTime").textContent = "That's " + local + " where you are.";
}

// ===== TIME ZONE LIST, WITH YOUR DEVICE'S ZONE PICKED =====
const tzSelect = document.getElementById("timezone");

function offsetLabel(zone) {
    try {
        const part = new Intl.DateTimeFormat("en-GB", { timeZone: zone, timeZoneName: "shortOffset" })
            .formatToParts(meeting)
            .find((p) => p.type === "timeZoneName");
        return part ? part.value : "";
    } catch {
        return "";
    }
}

let zones = [];
try {
    zones = Intl.supportedValuesOf("timeZone");
} catch {
    zones = [];
}

if (zones.length) {
    tzSelect.add(new Option("Choose one", ""));
    zones.forEach((zone) => {
        const label = zone.replace(/_/g, " ") + " (" + offsetLabel(zone) + ")";
        tzSelect.add(new Option(label, label, false, zone === myZone));
    });
} else {
    // Older browsers: simple GMT offsets
    tzSelect.add(new Option("Choose one", ""));
    for (let h = -12; h <= 14; h++) {
        const label = "GMT" + (h >= 0 ? "+" : "") + h;
        tzSelect.add(new Option(label, label));
    }
}

// ===== CHECKING THE FORM =====
function interestsPicked() {
    return form.querySelectorAll('input[name="interests"]:checked').length > 0;
}

form.addEventListener("change", (e) => {
    if (e.target.name === "interests" && interestsPicked()) interestsError.hidden = true;
    if (e.target.matches("input, select")) e.target.classList.remove("invalid");
});

function checkForm() {
    let firstBad = null;
    form.querySelectorAll("input[required], select[required]").forEach((field) => {
        const ok = field.checkValidity();
        field.classList.toggle("invalid", !ok);
        if (!ok && !firstBad) firstBad = field;
    });
    if (!interestsPicked()) {
        interestsError.hidden = false;
        if (!firstBad) firstBad = form.querySelector('input[name="interests"]');
    }
    if (firstBad) {
        formError.textContent = "Please fill in the highlighted boxes.";
        formError.hidden = false;
        firstBad.focus();
        return false;
    }
    formError.hidden = true;
    return true;
}

// ===== SENDING IT =====
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!checkForm()) return;

    if (SCRIPT_URL.startsWith("PASTE")) {
        formError.textContent = "Sign-ups aren't switched on yet. Please email us instead.";
        formError.hidden = false;
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
        const res = await fetch(SCRIPT_URL, {
            method: "POST",
            body: new URLSearchParams(new FormData(form))
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "Not saved");

        form.hidden = true;
        done.hidden = false;
        done.focus();
        window.scrollTo({ top: 0 });
    } catch {
        formError.textContent = "Something went wrong and your sign-up wasn't sent. Please try again, or email us at diab210111@diabstudents.com.";
        formError.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = "Sign Up";
    }
});
