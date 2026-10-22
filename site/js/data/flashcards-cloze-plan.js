(function buildFourteenDayClozePlan() {
  "use strict";

  /* Normalize every authored curriculum card. There is deliberately no per-day
     maximum: the source lesson decides how many cards exist. */
  var cards = window.FLASHCARDS || [];
  var lessons = window.LESSONS || {};
  var manualCloze = {
    "fc-d3-01": "Severe aortic stenosis is defined by an AVA {{c1::<1.0 cm2}}, mean gradient {{c1::>40 mmHg}}, and peak velocity {{c1::>4.0 m/s}} when flow is normal.",
    "fc-d3-09": "Mitral stenosis with atrial fibrillation, left-atrial thrombus, or prior embolism requires {{c1::vitamin K antagonist anticoagulation}}.",
    "fc-d4-09": "A complete coronary angiography report states anatomy/dominance, segmental stenoses, {{c1::TIMI flow}}, LV function/wall motion, and measured hemodynamics.",
    "fc-d5-02": "Beyond mortality, the STS model predicts major morbidity, ventilation, renal failure, stroke, wound infection, and {{c1::reoperation for bleeding}}.",
    "fc-d5-03": "STS and EuroSCORE II are population estimates that incompletely capture {{c1::frailty, hostile mediastinum, and extreme complexity}}.",
    "fc-d5-12": "A hostile mediastinum from prior surgery or radiation raises risk through adhesions, fibrosis, calcification, and {{c1::hazardous re-entry}} not fully represented by risk scores.",
    "fc-d5-19": "Prior stroke/TIA, a carotid bruit, known carotid disease, or advanced vascular risk should prompt {{c1::selective carotid assessment before CABG}}.",
    "fc-d6-02": "In SYNTAX, increasing anatomic complexity—especially a score {{c1::>=33}}—favored CABG over PCI for major adverse outcomes and repeat revascularization.",
    "fc-d6-04": "At 10 years, conduit durability is greatest for {{c1::LIMA-to-LAD}}, followed by radial artery and then saphenous vein grafts.",
    "fc-d7-07": "Younger age, existing anticoagulation, high redo risk, and a preference for durability favor a {{c1::mechanical prosthetic valve}}.",
    "fc-d7-15": "TAVR durability is least certain beyond {{c1::10 years}}, which matters most when lifetime management spans several future interventions.",
    "fc-d7-16": "The TAVR Heart Team integrates operative risk, frailty, vascular/anatomic feasibility, life expectancy, and {{c1::the patient's goals}}.",
    "fc-d7-25": "Typical mechanical-valve INR targets are {{c1::2.0-3.0 for aortic}} and {{c1::2.5-3.5 for mitral or double valves}}, adjusted for device and risk factors.",
    "fc-d8-12": "Unlike tamponade, constrictive pericarditis characteristically produces {{c1::Kussmaul sign and a dip-and-plateau filling pattern}}.",
    "fc-d9-14": "VA-ECMO supports refractory cardiogenic shock, ECPR, postcardiotomy shock, massive PE collapse, and {{c1::severe biventricular failure or myocarditis}}.",
    "fc-d9-16": "Major VA-ECMO complications include bleeding, thrombosis, hemolysis, infection, limb ischemia, and {{c1::circuit or oxygenator failure}}.",
    "fc-d11-02": "On TEG, prolonged R time suggests factor/heparin problems, low alpha angle suggests fibrinogen deficiency, and low MA suggests {{c1::poor clot strength, commonly platelet-related}}.",
    "fc-d13-06": "Low output with high CVP and low/normal PCWP suggests {{c1::right-ventricular failure}}, while equalized high filling pressures raise concern for tamponade."
  };

  function stripTags(html) {
    return String(html || "").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
  }

  function renderRawCloze(card, raw, detail) {
    var front = String(raw).replace(/\{\{c\d+::(.+?)(?:::.+?)?\}\}/g,
      '<span class="cloze-blank" aria-label="hidden answer">[…]</span>');
    var back = String(raw).replace(/\{\{c\d+::(.+?)(?:::.+?)?\}\}/g,
      '<b class="cloze-answer">$1</b>');
    card.kind = "cloze";
    card.cloze = raw;
    card.front = /^\s*</.test(front) ? front : "<p>" + front + "</p>";
    card.back = (/^\s*</.test(back) ? back : "<p>" + back + "</p>") +
      (detail ? '<details class="cloze-detail"><summary>Clinical detail</summary>' + detail + "</details>" : "");
    return card;
  }

  function recoverRawCloze(card) {
    if (card.cloze && /\{\{c\d+::/.test(card.cloze)) return card.cloze;
    var answers = [];
    String(card.back || "").replace(/<b class="cloze-answer">([\s\S]*?)<\/b>/gi, function (_, answer) {
      answers.push(stripTags(answer)); return _;
    });
    var i = 0;
    var raw = String(card.front || "").replace(/<span class="(?:cloze-blank|cloze)"[^>]*>[\s\S]*?<\/span>/gi, function () {
      var answer = answers[i++] || "answer";
      return "{{c" + i + "::" + answer + "}}";
    });
    return answers.length ? raw : "";
  }

  function toCloze(card) {
    if (manualCloze[card.id]) return renderRawCloze(card, manualCloze[card.id], card.back);
    if (card.kind === "cloze") {
      var recovered = recoverRawCloze(card);
      if (recovered) card.cloze = recovered;
      return card;
    }

    var bold = String(card.back || "").match(/<b(?:\s[^>]*)?>([^<]+)<\/b>/i);
    if (!bold) {
      /* No authored card is discarded. This branch should only be reached when a
         newly added legacy card lacks both a cloze and the manual conversion map. */
      var answer = stripTags(card.back).split(/[.!?](?:\s|$)/)[0].trim();
      if (!answer) answer = "Review the linked lesson explanation";
      return renderRawCloze(card, stripTags(card.front).replace(/\?\s*$/, "") + ": {{c1::" + answer + "}}", card.back);
    }

    var answerText = stripTags(bold[1]);
    var answerMarkup = bold[0];
    var answerIndex = card.back.indexOf(answerMarkup);
    var blockStart = Math.max(card.back.lastIndexOf("<p", answerIndex), card.back.lastIndexOf("<li", answerIndex));
    var tag = blockStart >= 0 && card.back.slice(blockStart, blockStart + 3).toLowerCase() === "<li" ? "li" : "p";
    var blockEnd = blockStart >= 0 ? card.back.indexOf("</" + tag + ">", answerIndex) : -1;
    var context = blockStart >= 0 && blockEnd >= 0
      ? card.back.slice(blockStart, blockEnd + tag.length + 3)
      : "<p>" + stripTags(card.front) + " <b>" + answerText + "</b></p>";
    var contextWithoutAnswer = stripTags(context.replace(answerMarkup, ""));
    if (contextWithoutAnswer.length < 12) {
      context = "<p>" + stripTags(card.front).replace(/\?\s*$/, "") + ': <b>' + answerText + "</b></p>";
      answerMarkup = "<b>" + answerText + "</b>";
    }

    card.depthKind = card.kind;
    return renderRawCloze(card, context.replace(answerMarkup, "{{c1::" + answerText + "}}"), card.back);
  }

  window.FLASHCARDS = cards.map(function (card) {
    if (card.lesson && lessons[card.lesson]) card.day = lessons[card.lesson].day;
    return toCloze(card);
  });
})();
