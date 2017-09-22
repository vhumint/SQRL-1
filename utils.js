"use strict";
const base56chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';

//uses https://raw.githubusercontent.com/peterolson/BigInteger.js/master/BigInteger.js
function base56encode(i)
{
	let bi;
	if (i instanceof bigInt)
		bi = i;
	else if (typeof i == "string")
		bi = bigInt(i);
	else if (typeof i == "number")
	{
		if (i > Number.MAX_SAFE_INTEGER)
			throw 'base56encode: ERROR. Argument 1 "i" larger than ' + Number.MAX_SAFE_INTEGER + ' should be represented as String or BigInt';
		bi = bigInt(i);
	}
	else
		throw 'base56encode: ERROR. Argument 1 "i" should be an integer represented as String, BigInt or Number';
	if (bi.lesser(0))
		throw 'base56encode: ERROR. Argument 1 "i" should be positive';
	let result = [];
	do
	{
		let { quotient: q, remainder: r } = bi.divmod(56);
		result.unshift(base56chars[r.toJSNumber()]);
		bi = q;
	}
	while (bi.greater(0));
	return result.join('');
}
function base56decode(s)
{
	if (typeof s != "string")
		throw 'base56decode: ERROR. Argument 1 "s" should be a String';
	if (/[^23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz]/.test(s))
		throw 'base56decode: ERROR. Argument 1 "s" can only contain valid base56 characters [23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz]';
	if (s == null || s == "")
		return 0;
	let result = bigInt(0);
	let factor = bigInt(1);
	for (let c of s.split('').reverse())
	{
		result = result.add(factor.multiply(base56chars.indexOf(c)));
		factor = factor.multiply(56);
	}
	return result;
}
function isValidHostname(hn)
{
	//FIXME: it is assumed that the hostname is punycode encoded - test and/or fix this
	/*
	Hostnames are composed of series of labels concatenated with dots, as are all domain names.
	For example, "en.wikipedia.org" is a hostname. Each label must be between 1 and 63 characters long, and the entire hostname has a maximum of 255 characters.
	RFCs mandate that a hostname's labels may contain only the ASCII letters 'a' through 'z' (case-insensitive), the digits '0' through '9', and the hyphen. Hostname labels cannot begin or end with a hyphen. No other symbols, punctuation characters, or blank spaces are permitted.
	*/
	if (hn == null || typeof hn != "string" || hn.length == 0 || hn.length  > 255 || !/^[a-zA-Z0-9\.\-]+$/.test(hn))
		return false;
	let splt = hn.split(".");
	for (let lbl of splt)
		if (lbl.length < 1 || lbl.length > 63 || lbl.startsWith('-') || lbl.endsWith('-'))
			return false;
	return true;
}
