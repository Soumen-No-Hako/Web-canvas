const JsTargetFile = 'web-canvas-render.js';

var lasthash = null;

async function hash(text) {
	const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
	return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2,'0')).join('');
}
async function check(targetFile) {
	try{
	const content = await fetch(targetFile, {cache: 'no-store'});
	if(!content.ok) return;
	const textContent = await content.text();
	const hashedValue = await hash(textContent);
	
	if(lasthash && hashedValue!=lasthash) location.reload();
	lasthash = hashedValue;
	} catch (e) {}
}

setInterval(() => check(JsTargetFile), 5000);