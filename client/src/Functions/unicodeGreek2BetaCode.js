export function unicodeGreek2BetaCode(unicodeGreek) {
	let betaCode = unicodeGreek
	betaCode = betaCode.normalize("NFD");// separates combined characters into parts
	betaCode = betaCode.replace(/[\u0300-\u036f]/g, "");
	betaCode = betaCode.replace(/[᾽ι᾿῀῁῍῎῏῝῞῟῭΅`´῾]/g, "");
	betaCode = betaCode.replace(/[α]/g, "a");
	betaCode = betaCode.replace(/[β]/g, "b");
	betaCode = betaCode.replace(/[γ]/g, "g");
	betaCode = betaCode.replace(/[δ]/g, "d");
	betaCode = betaCode.replace(/[ε]/g, "e");
	betaCode = betaCode.replace(/[ζ]/g, "z");
	betaCode = betaCode.replace(/[η]/g, "h");
	betaCode = betaCode.replace(/[θ]/g, "q");
	betaCode = betaCode.replace(/[ι]/g, "i");
	betaCode = betaCode.replace(/[κ]/g, "k");
	betaCode = betaCode.replace(/[λ]/g, "l");
	betaCode = betaCode.replace(/[μ]/g, "m");
	betaCode = betaCode.replace(/[ν]/g, "n");
	betaCode = betaCode.replace(/[ξ]/g, "c");
	betaCode = betaCode.replace(/[ο]/g, "o");
	betaCode = betaCode.replace(/[π]/g, "p");
	betaCode = betaCode.replace(/[ρ]/g, "r");
	betaCode = betaCode.replace(/[σς]/g, "s");
	betaCode = betaCode.replace(/[τ]/g, "t");
	betaCode = betaCode.replace(/[υ]/g, "u");
	betaCode = betaCode.replace(/[φ]/g, "f");
	betaCode = betaCode.replace(/[χ]/g, "x");
	betaCode = betaCode.replace(/[ψ]/g, "y");
	betaCode = betaCode.replace(/[ω]/g, "w");

	return betaCode;
}