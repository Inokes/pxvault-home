const DISCORD_USER_ID = "1465511821351063584";

export function setDiscordAvatar(imgEl) {
  const url = `https://discord-avatar.vercel.app/api/${DISCORD_USER_ID}?size=128`;
  imgEl.src = url;
}

