(function(){
  const ref = document.referrer;
  const llmSources = ["chat.openai.com", "www.perplexity.ai", "bard.google.com", "you.com"];
  const isLLM = llmSources.some(source => ref.includes(source));
  if (isLLM) {
    fetch("/api/track-llm-hit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referrer: ref, url: window.location.href })
    });
  }
})();
