
let currentScene = "scene1";

async function loadStory() {
  try {
    const res = await fetch("story_with_next.json"); // 파일 이름 확인
    if (!res.ok) {
      throw new Error("HTTP 오류: " + res.status);
    }
    return await res.json();
  } catch (err) {
    document.getElementById("scene").innerText = "스토리 로딩 실패: " + err.message;
    console.error("스토리 로딩 실패", err);
    throw err;
  }
}

function renderScene(story, chapter, sceneId) {
  const scene = story[chapter][sceneId];
  document.getElementById("scene").innerText = scene.text;
  const choices = document.getElementById("choices");
  choices.innerHTML = "";

  if (scene.ending) {
    const endMsg = document.createElement("p");
    endMsg.textContent = "🌙 " + scene.ending;
    choices.appendChild(endMsg);
    return;
  }

  for (const key of Object.keys(scene)) {
    if (key.startsWith("q")) {
      const btn = document.createElement("button");
      btn.textContent = scene[key];
      btn.onclick = () => {
        const nextScene = scene.next?.[key];
        if (nextScene) {
          renderScene(story, chapter, nextScene);
        } else {
          alert("다음 장면이 아직 연결되지 않았습니다.");
        }
      };
      choices.appendChild(btn);
    }
  }
}

loadStory()
  .then(story => {
    renderScene(story, "chapter1", currentScene);
  });
