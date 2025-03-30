const g_month_lengths = [31,28,31,30,31,30,31,31,30,31,30,31]
const g_leap_year_month_lengths = [31,29,31,30,31,30,31,31,30,31,30,31]
const g_metonic_cycle = [12,13,12,12,13,12,13,12,12,13,12,12,13,12,13,12,12,13,12]
const g_month_names = [
	"Aries",
	"Taurus",
	"Gemini",
	"Cancer",
	"Leo",
	"Virgo",
	"Libra",
	"Scorpius",
	"Sagittarius",
	"Capricornus",
	"Aquarius",
	"Pisces",
	"Terra"
]
const g_month_abbreviations = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir",
	"Lib", "Sco", "Sag", "Cap", "Aqu", "Pis", "Ter"]

function mod(n, d) {
	return ((n % d) + d) % d
}

function gregorian_month_length(y, m) {
	var month_lengths = g_month_lengths
	if (gregorian_is_leap_year(y)) {
		month_lengths = g_leap_year_month_lengths
	}
	return month_lengths[m-1]
}

function gregorian_is_leap_year(y) {
	if (mod(y, 400) == 0) {
		return true
	} else if (mod(y, 100) == 0) {
		return false
	} else if (mod(y, 4) == 0) {
		return true
	} else {
		return false
	}
}

function gregorian_year_length(y) {
	return 12
}

function julian_year_length(y) {
	return 12
}

function julian_month_length(y, m) {
	var month_lengths = g_month_lengths
	if (julian_is_leap_year(y)) {
		month_lengths = g_leap_year_month_lengths
	}
	return month_lengths[m-1]
}

function julian_is_leap_year(y) {
	if (mod(y, 4) == 0) {
		return true
	} else {
		return false
	}
}

function danetian_months_in_previous_years_within_metonic_cycle(y) {
	var HR = mod(y - 1, 334) + 1
	var KR = mod(HR - 1, 19) + 1
	var s = 0
	for (var i = 1; i <= KR-1; i++) {
		s += g_metonic_cycle[i-1]
	}
	return s
}

function gregorian_days_in_previous_months_within_year(y, m) {
	var s = 0
	for (var i = 1; i <= m - 1; i++) {
		s += gregorian_month_length(y, m)
	}
	return s
}

function julian_days_in_previous_months_within_year(y, m) {
	var s = 0
	for (var i = 1; i <= m - 1; i++) {
		s += julian_month_length(y, m)
	}
	return s
}

function danetian_year_length(y) {
	var HR = mod(y - 1, 334) + 1
	var KR = mod(HR - 1, 19) + 1
	return g_metonic_cycle[KR-1]
}

function danetian_month_ordinal(y, m) {
	var H = Math.floor((y - 1) / 334)
	var HR = mod(y - 1, 334) + 1
	var K = Math.floor((HR - 1) / 19)
	var U = danetian_months_in_previous_years_within_metonic_cycle(y)
	var n = 4131*H + 235*K + U + m
	return n
}

function danetian_month_length(y, m) {
	var n = danetian_month_ordinal(y, m)
	var HR = mod(n - 1, 850) + 1
	var KR = mod(HR - 1, 49) + 1
	var LR = mod(KR - 1, 17) + 1
	var MR = mod(LR - 1, 2) + 1
	if (mod(MR, 2) == 1) {
		return 30
	} else {
		return 29
	}
}
/*
function danetian_to_julian_day(y, m, d) {
	var n = danetian_month_ordinal(y, m)
	var H = Math.floor((n - 1) / 850)
	var HR = mod(n - 1, 850) + 1
	var K = Math.floor((HR - 1) / 49)
	var KR = mod(HR - 1, 49) + 1
	var L = Math.floor((KR - 1) / 17)
	var LR = mod(KR - 1, 17) + 1
	var M = Math.floor((LR - 1) / 2)
	var MR = mod(LR - 1, 2) + 1
	var offset = 1237193
	return 25101*H + 1447*K + 502*L + 59*M + 30*(MR-1) + offset + d
}
*/
/*
function julian_to_julian_day(y, m, d) {
	offset = 1721423
	Q = Math.floor((y - 1) / 4)
	QR = (y - 1) % 4 + 1
	U = julian_days_in_previous_months_within_year(y, m)
	n = 1461*Q + 365*(QR-1) + U + d + offset
	return n
}
*/
function danetian_is_valid(y, m, d) {
	var d_max = danetian_month_length(y, m)
	var m_max = danetian_year_length(y)

	return (1 <= d) && (d <= d_max) && (1 <= m) && (m <= m_max)
}

function gregorian_is_valid(y, m, d) {
	var d_max = gregorian_month_length(y, m)
	var m_max = gregorian_year_length(y)
	return (1 <= d) && (d <= d_max) && (1 <= m) && (m <= m_max)
}

function julian_is_valid(y, m, d) {
	var d_max = julian_month_length(y, m)
	var m_max = julian_year_length(y)
	return (1 <= d) && (d <= d_max) && (1 <= m) && (m <= m_max)
}

function danetian_date_shift(y, m, d, n) {
	if (n == 0) {
	} else if (0 < n) {
		d += n
		while (!danetian_is_valid(y, m, d)) {
			d -= danetian_month_length(y, m)
			m += 1
			if (danetian_year_length(y) < m) {
				y += 1
				m = 1
			}
		}
	} else if (n < 0) {
		d += n
		while (!danetian_is_valid(y, m, d)) {
			m -= 1
			if (m < 1) {
				y -= 1
				m = danetian_year_length(y)
			}
			d += danetian_month_length(y, m)
		}
	}
	return [y, m, d]
}

function gregorian_date_shift(y, m, d, n) {
	if (n == 0) {
	} else if (0 < n) {
		d += n
		while (!gregorian_is_valid(y, m, d)) {
			d -= gregorian_month_length(y, m)
			m += 1
			if (gregorian_year_length(y) < m) {
				y += 1
				m = 1
			}
		}
	} else if (n < 0) {
		d += n
		while (!gregorian_is_valid(y, m, d)) {
			m -= 1
			if (m < 1) {
				y -= 1
				m = gregorian_year_length(y)
			}
			d += gregorian_month_length(y, m)
		}
	}
	return [y, m, d]
}

function julian_date_shift(y, m, d, n) {
	if (n == 0) {
	} else if (0 < n) {
		d += n
		while (!julian_is_valid(y, m, d)) {
			d -= julian_month_length(y, m)
			m += 1
			if (julian_year_length(y) < m) {
				y += 1
				m = 1
			}
		}
	} else if (n < 0) {
		d += n
		while (!julian_is_valid(y, m, d)) {
			m -= 1
			if (m < 1) {
				y -= 1
				m = julian_year_length(y)
			}
			d += julian_month_length(y, m)
		}
	}
	return [y, m, d]
}

function compare_dates(y1, m1, d1, y2, m2, d2) {
	if (y2 - y1 != 0) {
		return Math.sign(y2 - y1)
	} else if (m2 - m1 != 0) {
		return Math.sign(m2 - m1)
	} else {
		return Math.sign(d2 - d1)
	}
}

function gregorian_to_julian_day(y, m, d) {
	//var [yi, mi, di] = [-4713, 11, 24]
	//var [yi, mi, di, ni] = [-4713, 11, 24, 0]
	var [yi, mi, di, ni] = [2025, 3, 29, 2460764]
	var [yf, mf, df] = [y, m, d]
	var s = ni
	var sign = compare_dates(yi, mi, di, y, m, d)
	var delta = 1 * sign
	while (sign != 0) {
		var new_sign = compare_dates(yi, mi, di, y, m, d)
		if (new_sign == sign) {
			delta *= 2
		} else {
			delta = new_sign
		}
		sign = new_sign

		//var sign = compare_dates(yi, mi, di, yf, mf, df)
		var [yi, mi, di] = gregorian_date_shift(yi, mi, di, delta)
		s += delta
	}
	return s
}

function julian_to_julian_day(y, m, d) {
	//var [yi, mi, di] = [-4712, 1, 1]
	//var [yi, mi, di, ni] = [-4712, 1, 1, 0]
	var [yi, mi, di, ni] = [2025, 3, 16, 2460764]
	var [yf, mf, df] = [y, m, d]
	var s = ni
	var sign = compare_dates(yi, mi, di, y, m, d)
	var delta = 1 * sign
	while (sign != 0) {
		var new_sign = compare_dates(yi, mi, di, y, m, d)
		if (new_sign == sign) {
			delta *= 2
		} else {
			delta = new_sign
		}
		sign = new_sign

		//var sign = compare_dates(yi, mi, di, yf, mf, df)
		var [yi, mi, di] = julian_date_shift(yi, mi, di, delta)
		s += delta
	}
	return s
}

function danetian_to_julian_day(y, m, d) {
	//var [yi, mi, di] = [-3387, 9, 21]
	//var [yi, mi, di, ni] = [-3387, 9, 21, 0]
	var [yi, mi, di, ni] = [3351, 1, 1, 2460764]
	var [yf, mf, df] = [y, m, d]
	var s = ni
	var sign = compare_dates(yi, mi, di, y, m, d)
	var delta = 1 * sign
	while (sign != 0) {
		var new_sign = compare_dates(yi, mi, di, y, m, d)
		if (new_sign == sign) {
			delta *= 2
		} else {
			delta = new_sign
		}
		sign = new_sign

		//var sign = compare_dates(yi, mi, di, yf, mf, df)
		var [yi, mi, di] = danetian_date_shift(yi, mi, di, delta)
		s += delta
	}
	return s
}

function julian_from_julian_day(n) {
	//var [yi, mi, di] = [-4712, 1, 1]
	//var [yi, mi, di, ni] = [-4712, 1, 1, 0]
	var [yi, mi, di, ni] = [2025, 3, 16, 2460764]
	return julian_date_shift(yi, mi, di, n - ni)
}

function gregorian_from_julian_day(n) {
	//var [yi, mi, di] = [-4713, 11, 24]
	//var [yi, mi, di, ni] = [-4713, 11, 24, 0]
	var [yi, mi, di, ni] = [2025, 3, 29, 2460764]
	return gregorian_date_shift(yi, mi, di, n - ni)
}

function danetian_from_julian_day(n) {
	//var [yi, mi, di] = [-3387, 9, 21]
	//var [yi, mi, di, ni] = [-3387, 9, 21, 0]
	var [yi, mi, di, ni] = [3351, 1, 1, 2460764]
	return danetian_date_shift(yi, mi, di, n - ni)
}

function get_current_date() {
	var today = new Date()
	//var u = date.toISOString()
	var y = today.getFullYear() //u.slice(0,4)*1
	var m = today.getMonth() + 1 //u.slice(5,7)*1
	var d = today.getDate() //u.slice(8,10)*1
	return [y, m, d]
}

function zero_padding(y, n) {
	sign = Math.sign(y)
	var ys = "" + Math.abs(y)
	while ((0 < ys.length) && (ys.length < n)) {
		ys = "0" + ys
	}

	if (sign < 0) {
		ys = '-' + ys
	}
	return ys
}

function iso_format(y, m, d) {
	var ys = zero_padding(y, 4)
	var ms = zero_padding(m, 2)
	var ds = zero_padding(d, 2)

	return ys + "-" + ms + "-" + ds
}

function verbose_format(y, m, d) {
	var ys = zero_padding(y, 4)
	var ms = g_month_names[m - 1]
	var ds = zero_padding(d, 2)

	return ds + " " + ms + " " + ys
}

function interpret_date_string(s) {
	var n = s.length
	var d = s.slice(n-2,n)*1
	var m = s.slice(n-5,n-3)*1
	var y = s.slice(0,n-6)*1
	return [y, m, d]
}

function danetian_today_string() {
	var [y, m, d] = get_current_date()
	var n = gregorian_to_julian_day(y, m, d)
	var [yn, mn, dn] = danetian_from_julian_day(n)
	//var s = iso_format(yn, mn, dn)
	var s = verbose_format(yn, mn, dn)
	return s
}

function gregorianToDanetian(date) {
	// your internal logic using date.getFullYear(), getMonth(), getDate()
	// should return a string like "01 Aries 3351"

	const jd = gregorianToJD(date.getFullYear(), date.getMonth() + 1, date.getDate());
	const [dYear, dMonth, dDay] = jdToDanetian(jd); // Your custom function
	const monthName = danetianMonthNames[dMonth - 1]; // Assuming this exists
	return `${String(dDay).padStart(2, '0')} ${monthName} ${dYear}`;
}

//var n = gregorian_to_julian_day(-200000,1,1)
//var [y,m,d] = danetian_from_julian_day(n)
//console.log(y,m,d)
