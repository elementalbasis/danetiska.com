# The Danetian Calendar

The Danetian calendar is a lunisolar calendar used by the Danetian people.
Each month starts and ends at roughly the new moon.

The synodic period of the Moon is around 29.530 588 days. Therefore, the
months of the calendar alternate between 29 and 30 days in order to keep them in
sync with the phases of the Moon. If a month has 29 days, it's called a hollow
month; if it has 30, it's called a full month.

Grouping months into years presents a challenge: If a year is defined to be
12 months, that results in 354 days, which is too short. If we instead define a
year as 13 months, the result is roughly 383 days, which is too long. To get
around this, some years are set to have 12 months, while others have 13, so that
the average year length ends up being around 365.2421 days. Essentially, an
entire leap month is inserted every two or three years in order to keep the
calendar in sync with the seasons.

## Calendar Calculator

<form id="form_calendar_calculator">
    <label for="input_date">Enter date:</label>
    <input type="text" id="input_date" placeholder="YYYY-MM-DD" required>
    <label for="select_calendar">Interpret as:</label>
    <select id="select_calendar" required>
        <option value="g">Gregorian</option>
        <option value="j">Julian</option>
        <option value="d">Danetian</option>
    </select>
    <input type="submit" value="Submit">
</form>
<p id="result_gregorian"></p>
<p id="result_julian"></p>
<p id="result_danetian"></p>
<script src="scripts/calculator.js" defer></script>


## Month names

The twelve months are named according to a modified version of the Chinese
zodiac:

1. Rat
2. Ox
3. Wolf (Tiger in the Chinese zodiac)
4. Rabbit
5. Eagle (Dragon in the Chinese zodiac)
6. Snake
7. Horse
8. Goat
9. Hedgehog (Monkey in the Chinese zodiac)
10. Rooster
11. Dog
12. Pig
13. Epagomenal (only in leap years)

The Danetians use these month names because they lived alongside Turkic
tribes for several centuries. It was common for these Turkic tribes to use a
modified version of the Chinese zodiac, with some animals replaced by local
fauna.



## Mathematical rules for months

Months alternate between full (30 days) and hollow (29 days) in a specified
pattern in order to keep the average month length equal to 29.530&nbsp;588 days.
By writing this number as a continued fraction, we can see that two rational
approximants arise: 1447&nbsp;/&nbsp;49 and 25&nbsp;101&nbsp;/&nbsp;850.
That is to say, we can
approximate the synodic period of the Moon by arranging 1447 days into 49
months, or 25&nbsp;101 days into 850 months for an even better approximation.

In order to accomplish this, certain months are recognized as "metallic
months". These are always full months, and are characterized by the "metallic
month festivals": the Iron Month Festival, the Silver Month Festival, and the
Golden Month Festival. Certain rules are in place:

1. After a hollow month always comes a full month, and vice-versa.
2. After counting 17 months, the next month is recognized as an iron
month. Iron months are always full months, superseding rule #1.
3. After counting 49 months, the next month is recognized as a silver
month. Silver months are always full months, superseding rule #1. Moreover,
they reset the iron month count, superseding rule #2.
4. After counting 850 months, the next month is recognized as a golden
month. Golden months are always full months, superseding rule #1.
Moreover, they reset both the iron month count and the
silver month count, thereby superseding rules #2 and #3.



## Mathematical rules for years

Years can either be short (12 months) or long (13 months; also called leap
years). The average length of the
month is 25&nbsp;101&nbsp;/&nbsp;850 = 29.530&nbsp;588. Thus,
in order to remain in step with the tropical year of 365.2421 days, the most
appropriate rational approximants to use are 235&nbsp;/&nbsp;19
and 4131&nbsp;/&nbsp;334.

The fraction 235&nbsp;/&nbsp;19 represents the Metonic cycle,
which was already known in
antiquity; it arranges 235 months into 19 years.

The calendar uses a system similar to that of metallic months, celebrating
the Silver Year Festival and the Golden Year Festival. The following rules are
in place:

1. Within a cycle of 19 years, the following years are leap
years: #2, #5, #7, #10, #13, #15, #18.
2. After counting 19 years, the next year is known as a silver year,
and it marks the beginning of a new Metonic cycle.
3. After counting 334 years, the next year is known as a golden year.
This resets the silver year count, superseding rule #2.



## Sexagenary cycle

Another tradition inherited from the Chinese calendar is the sexagenary
cycle. The twelve animals of the zodiac are combined with the five elements
(wood, fire, earth, metal, water) in order to give a cycle of 60 years:

1. wood rat
2. wood ox
3. fire wolf
4. fire rabbit
5. earth eagle
6. earth snake
7. metal horse
8. metal goat
9. water hedgehog
10. water rooster
11. wood dog
12. wood pig
13. fire rat
14. fire ox
15. earth wolf
16. earth rabbit
17. ...


The current sexagenary cycle began in the year 3310, or 1984 in our
calendar.



## Calendar files

[Here](assets/calendar/3351.pdf) is the calendar for the current year. You may also
browse any of the calendar files for other years:

* [3250 (05 Apr 1924 -- 24 Mar 1925)](assets/calendar/3250.pdf)
* [3251 (25 Mar 1925 -- 13 Mar 1926)](assets/calendar/3251.pdf)
* [3252 (14 Mar 1926 -- 01 Apr 1927)](assets/calendar/3252.pdf)
* [3253 (02 Apr 1927 -- 21 Mar 1928)](assets/calendar/3253.pdf)
* [3254 (22 Mar 1928 -- 10 Mar 1929)](assets/calendar/3254.pdf)
* [3255 (11 Mar 1929 -- 29 Mar 1930)](assets/calendar/3255.pdf)
* [3256 (30 Mar 1930 -- 18 Mar 1931)](assets/calendar/3256.pdf)
* [3257 (19 Mar 1931 -- 07 Mar 1932)](assets/calendar/3257.pdf)
* [3258 (08 Mar 1932 -- 26 Mar 1933)](assets/calendar/3258.pdf)
* [3259 (27 Mar 1933 -- 15 Mar 1934)](assets/calendar/3259.pdf)
* [3260 (16 Mar 1934 -- 03 Apr 1935)](assets/calendar/3260.pdf)
* [3261 (04 Apr 1935 -- 22 Mar 1936)](assets/calendar/3261.pdf)
* [3262 (23 Mar 1936 -- 12 Mar 1937)](assets/calendar/3262.pdf)
* [3263 (13 Mar 1937 -- 30 Mar 1938)](assets/calendar/3263.pdf)
* [3264 (31 Mar 1938 -- 20 Mar 1939)](assets/calendar/3264.pdf)
* [3265 (21 Mar 1939 -- 08 Mar 1940)](assets/calendar/3265.pdf)
* [3266 (09 Mar 1940 -- 27 Mar 1941)](assets/calendar/3266.pdf)
* [3267 (28 Mar 1941 -- 16 Mar 1942)](assets/calendar/3267.pdf)
* [3268 (17 Mar 1942 -- 04 Apr 1943)](assets/calendar/3268.pdf)
* [3269 (05 Apr 1943 -- 24 Mar 1944)](assets/calendar/3269.pdf)
* [3270 (25 Mar 1944 -- 13 Mar 1945)](assets/calendar/3270.pdf)
* [3271 (14 Mar 1945 -- 01 Apr 1946)](assets/calendar/3271.pdf)
* [3272 (02 Apr 1946 -- 21 Mar 1947)](assets/calendar/3272.pdf)
* [3273 (22 Mar 1947 -- 10 Mar 1948)](assets/calendar/3273.pdf)
* [3274 (11 Mar 1948 -- 29 Mar 1949)](assets/calendar/3274.pdf)
* [3275 (30 Mar 1949 -- 18 Mar 1950)](assets/calendar/3275.pdf)
* [3276 (19 Mar 1950 -- 07 Mar 1951)](assets/calendar/3276.pdf)
* [3277 (08 Mar 1951 -- 25 Mar 1952)](assets/calendar/3277.pdf)
* [3278 (26 Mar 1952 -- 15 Mar 1953)](assets/calendar/3278.pdf)
* [3279 (16 Mar 1953 -- 03 Apr 1954)](assets/calendar/3279.pdf)
* [3280 (04 Apr 1954 -- 23 Mar 1955)](assets/calendar/3280.pdf)
* [3281 (24 Mar 1955 -- 11 Mar 1956)](assets/calendar/3281.pdf)
* [3282 (12 Mar 1956 -- 30 Mar 1957)](assets/calendar/3282.pdf)
* [3283 (31 Mar 1957 -- 20 Mar 1958)](assets/calendar/3283.pdf)
* [3284 (21 Mar 1958 -- 09 Mar 1959)](assets/calendar/3284.pdf)
* [3285 (10 Mar 1959 -- 27 Mar 1960)](assets/calendar/3285.pdf)
* [3286 (28 Mar 1960 -- 16 Mar 1961)](assets/calendar/3286.pdf)
* [3287 (17 Mar 1961 -- 04 Apr 1962)](assets/calendar/3287.pdf)
* [3288 (05 Apr 1962 -- 24 Mar 1963)](assets/calendar/3288.pdf)
* [3289 (25 Mar 1963 -- 13 Mar 1964)](assets/calendar/3289.pdf)
* [3290 (14 Mar 1964 -- 01 Apr 1965)](assets/calendar/3290.pdf)
* [3291 (02 Apr 1965 -- 21 Mar 1966)](assets/calendar/3291.pdf)
* [3292 (22 Mar 1966 -- 10 Mar 1967)](assets/calendar/3292.pdf)
* [3293 (11 Mar 1967 -- 28 Mar 1968)](assets/calendar/3293.pdf)
* [3294 (29 Mar 1968 -- 18 Mar 1969)](assets/calendar/3294.pdf)
* [3295 (19 Mar 1969 -- 07 Mar 1970)](assets/calendar/3295.pdf)
* [3296 (08 Mar 1970 -- 26 Mar 1971)](assets/calendar/3296.pdf)
* [3297 (27 Mar 1971 -- 14 Mar 1972)](assets/calendar/3297.pdf)
* [3298 (15 Mar 1972 -- 02 Apr 1973)](assets/calendar/3298.pdf)
* [3299 (03 Apr 1973 -- 23 Mar 1974)](assets/calendar/3299.pdf)
* [3300 (24 Mar 1974 -- 12 Mar 1975)](assets/calendar/3300.pdf)
* [3301 (13 Mar 1975 -- 30 Mar 1976)](assets/calendar/3301.pdf)
* [3302 (31 Mar 1976 -- 19 Mar 1977)](assets/calendar/3302.pdf)
* [3303 (20 Mar 1977 -- 09 Mar 1978)](assets/calendar/3303.pdf)
* [3304 (10 Mar 1978 -- 27 Mar 1979)](assets/calendar/3304.pdf)
* [3305 (28 Mar 1979 -- 16 Mar 1980)](assets/calendar/3305.pdf)
* [3306 (17 Mar 1980 -- 04 Apr 1981)](assets/calendar/3306.pdf)
* [3307 (05 Apr 1981 -- 24 Mar 1982)](assets/calendar/3307.pdf)
* [3308 (25 Mar 1982 -- 13 Mar 1983)](assets/calendar/3308.pdf)
* [3309 (14 Mar 1983 -- 31 Mar 1984)](assets/calendar/3309.pdf)
* [3310 (01 Apr 1984 -- 21 Mar 1985)](assets/calendar/3310.pdf)
* [3311 (22 Mar 1985 -- 10 Mar 1986)](assets/calendar/3311.pdf)
* [3312 (11 Mar 1986 -- 29 Mar 1987)](assets/calendar/3312.pdf)
* [3313 (30 Mar 1987 -- 17 Mar 1988)](assets/calendar/3313.pdf)
* [3314 (18 Mar 1988 -- 07 Mar 1989)](assets/calendar/3314.pdf)
* [3315 (08 Mar 1989 -- 26 Mar 1990)](assets/calendar/3315.pdf)
* [3316 (27 Mar 1990 -- 15 Mar 1991)](assets/calendar/3316.pdf)
* [3317 (16 Mar 1991 -- 02 Apr 1992)](assets/calendar/3317.pdf)
* [3318 (03 Apr 1992 -- 22 Mar 1993)](assets/calendar/3318.pdf)
* [3319 (23 Mar 1993 -- 12 Mar 1994)](assets/calendar/3319.pdf)
* [3320 (13 Mar 1994 -- 31 Mar 1995)](assets/calendar/3320.pdf)
* [3321 (01 Apr 1995 -- 19 Mar 1996)](assets/calendar/3321.pdf)
* [3322 (20 Mar 1996 -- 08 Mar 1997)](assets/calendar/3322.pdf)
* [3323 (09 Mar 1997 -- 27 Mar 1998)](assets/calendar/3323.pdf)
* [3324 (28 Mar 1998 -- 17 Mar 1999)](assets/calendar/3324.pdf)
* [3325 (18 Mar 1999 -- 03 Apr 2000)](assets/calendar/3325.pdf)
* [3326 (04 Apr 2000 -- 24 Mar 2001)](assets/calendar/3326.pdf)
* [3327 (25 Mar 2001 -- 13 Mar 2002)](assets/calendar/3327.pdf)
* [3328 (14 Mar 2002 -- 01 Apr 2003)](assets/calendar/3328.pdf)
* [3329 (02 Apr 2003 -- 20 Mar 2004)](assets/calendar/3329.pdf)
* [3330 (21 Mar 2004 -- 10 Mar 2005)](assets/calendar/3330.pdf)
* [3331 (11 Mar 2005 -- 29 Mar 2006)](assets/calendar/3331.pdf)
* [3332 (30 Mar 2006 -- 18 Mar 2007)](assets/calendar/3332.pdf)
* [3333 (19 Mar 2007 -- 06 Mar 2008)](assets/calendar/3333.pdf)
* [3334 (07 Mar 2008 -- 25 Mar 2009)](assets/calendar/3334.pdf)
* [3335 (26 Mar 2009 -- 15 Mar 2010)](assets/calendar/3335.pdf)
* [3336 (16 Mar 2010 -- 03 Apr 2011)](assets/calendar/3336.pdf)
* [3337 (04 Apr 2011 -- 22 Mar 2012)](assets/calendar/3337.pdf)
* [3338 (23 Mar 2012 -- 11 Mar 2013)](assets/calendar/3338.pdf)
* [3339 (12 Mar 2013 -- 30 Mar 2014)](assets/calendar/3339.pdf)
* [3340 (31 Mar 2014 -- 20 Mar 2015)](assets/calendar/3340.pdf)
* [3341 (21 Mar 2015 -- 08 Mar 2016)](assets/calendar/3341.pdf)
* [3342 (09 Mar 2016 -- 27 Mar 2017)](assets/calendar/3342.pdf)
* [3343 (28 Mar 2017 -- 16 Mar 2018)](assets/calendar/3343.pdf)
* [3344 (17 Mar 2018 -- 06 Mar 2019)](assets/calendar/3344.pdf)
* [3345 (07 Mar 2019 -- 23 Mar 2020)](assets/calendar/3345.pdf)
* [3346 (24 Mar 2020 -- 13 Mar 2021)](assets/calendar/3346.pdf)
* [3347 (14 Mar 2021 -- 01 Apr 2022)](assets/calendar/3347.pdf)
* [3348 (02 Apr 2022 -- 21 Mar 2023)](assets/calendar/3348.pdf)
* [3349 (22 Mar 2023 -- 09 Mar 2024)](assets/calendar/3349.pdf)
* [3350 (10 Mar 2024 -- 28 Mar 2025)](assets/calendar/3350.pdf)
* [3351 (29 Mar 2025 -- 18 Mar 2026)](assets/calendar/3351.pdf)
* [3352 (19 Mar 2026 -- 07 Mar 2027)](assets/calendar/3352.pdf)
* [3353 (08 Mar 2027 -- 25 Mar 2028)](assets/calendar/3353.pdf)
* [3354 (26 Mar 2028 -- 14 Mar 2029)](assets/calendar/3354.pdf)
* [3355 (15 Mar 2029 -- 02 Apr 2030)](assets/calendar/3355.pdf)
* [3356 (03 Apr 2030 -- 23 Mar 2031)](assets/calendar/3356.pdf)
* [3357 (24 Mar 2031 -- 11 Mar 2032)](assets/calendar/3357.pdf)
* [3358 (12 Mar 2032 -- 30 Mar 2033)](assets/calendar/3358.pdf)
* [3359 (31 Mar 2033 -- 19 Mar 2034)](assets/calendar/3359.pdf)
* [3360 (20 Mar 2034 -- 09 Mar 2035)](assets/calendar/3360.pdf)
* [3361 (10 Mar 2035 -- 27 Mar 2036)](assets/calendar/3361.pdf)
* [3362 (28 Mar 2036 -- 16 Mar 2037)](assets/calendar/3362.pdf)
* [3363 (17 Mar 2037 -- 05 Mar 2038)](assets/calendar/3363.pdf)
* [3364 (06 Mar 2038 -- 24 Mar 2039)](assets/calendar/3364.pdf)
* [3365 (25 Mar 2039 -- 13 Mar 2040)](assets/calendar/3365.pdf)
* [3366 (14 Mar 2040 -- 31 Mar 2041)](assets/calendar/3366.pdf)
* [3367 (01 Apr 2041 -- 21 Mar 2042)](assets/calendar/3367.pdf)
* [3368 (22 Mar 2042 -- 10 Mar 2043)](assets/calendar/3368.pdf)
* [3369 (11 Mar 2043 -- 28 Mar 2044)](assets/calendar/3369.pdf)
* [3370 (29 Mar 2044 -- 17 Mar 2045)](assets/calendar/3370.pdf)
* [3371 (18 Mar 2045 -- 07 Mar 2046)](assets/calendar/3371.pdf)
* [3372 (08 Mar 2046 -- 26 Mar 2047)](assets/calendar/3372.pdf)
* [3373 (27 Mar 2047 -- 14 Mar 2048)](assets/calendar/3373.pdf)
* [3374 (15 Mar 2048 -- 02 Apr 2049)](assets/calendar/3374.pdf)
* [3375 (03 Apr 2049 -- 22 Mar 2050)](assets/calendar/3375.pdf)
* [3376 (23 Mar 2050 -- 12 Mar 2051)](assets/calendar/3376.pdf)
* [3377 (13 Mar 2051 -- 30 Mar 2052)](assets/calendar/3377.pdf)
* [3378 (31 Mar 2052 -- 19 Mar 2053)](assets/calendar/3378.pdf)
* [3379 (20 Mar 2053 -- 08 Mar 2054)](assets/calendar/3379.pdf)
* [3380 (09 Mar 2054 -- 27 Mar 2055)](assets/calendar/3380.pdf)
* [3381 (28 Mar 2055 -- 16 Mar 2056)](assets/calendar/3381.pdf)
* [3382 (17 Mar 2056 -- 05 Mar 2057)](assets/calendar/3382.pdf)
* [3383 (06 Mar 2057 -- 24 Mar 2058)](assets/calendar/3383.pdf)
* [3384 (25 Mar 2058 -- 13 Mar 2059)](assets/calendar/3384.pdf)
* [3385 (14 Mar 2059 -- 31 Mar 2060)](assets/calendar/3385.pdf)
* [3386 (01 Apr 2060 -- 20 Mar 2061)](assets/calendar/3386.pdf)
* [3387 (21 Mar 2061 -- 10 Mar 2062)](assets/calendar/3387.pdf)
* [3388 (11 Mar 2062 -- 29 Mar 2063)](assets/calendar/3388.pdf)
* [3389 (30 Mar 2063 -- 17 Mar 2064)](assets/calendar/3389.pdf)
* [3390 (18 Mar 2064 -- 06 Mar 2065)](assets/calendar/3390.pdf)
* [3391 (07 Mar 2065 -- 25 Mar 2066)](assets/calendar/3391.pdf)
* [3392 (26 Mar 2066 -- 15 Mar 2067)](assets/calendar/3392.pdf)
* [3393 (16 Mar 2067 -- 02 Apr 2068)](assets/calendar/3393.pdf)
* [3394 (03 Apr 2068 -- 22 Mar 2069)](assets/calendar/3394.pdf)
* [3395 (23 Mar 2069 -- 11 Mar 2070)](assets/calendar/3395.pdf)
* [3396 (12 Mar 2070 -- 30 Mar 2071)](assets/calendar/3396.pdf)
* [3397 (31 Mar 2071 -- 19 Mar 2072)](assets/calendar/3397.pdf)
* [3398 (20 Mar 2072 -- 08 Mar 2073)](assets/calendar/3398.pdf)
* [3399 (09 Mar 2073 -- 27 Mar 2074)](assets/calendar/3399.pdf)
* [3400 (28 Mar 2074 -- 16 Mar 2075)](assets/calendar/3400.pdf)
