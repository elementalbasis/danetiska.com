window.onload = function() {
	let p = danetian_today_string()
	let q = gregorian_today_string()
	document.getElementById("danetian_date_today").textContent = p
	document.getElementById("gregorian_date_today").textContent = q
}
