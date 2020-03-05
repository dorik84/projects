package tools;

/**
 * Fraction Custom Class 
 * @author Oleksandr Doroshchuk
 *
 */

public class Fraction {


	private int numerator;
	private int denominator;
	private int intPart;       
	
	//----------------------------------------------constructors
	
	/**
	 * Creates a Fraction object of whole + num/denom
	 * @param whole a whole component of the fraction
	 * @param num a numerator of the fraction
	 * @param denom a denominator of the fraction
	 */
	public Fraction(int whole, int num, int denom) {
		setInteger(whole);
		setNumerator(num);
		setDenominator(denom);
	}
	
	/**
	 * Creates a Fraction object of num/denom
	 * @param num numerator of the fraction
	 * @param denom denominator of the fraction
	 */
	public Fraction(int num, int denom) {
		this(0, num, denom);
	}
	
	/**
	 * Creates a Fraction object of whole/1
	 * @param whole a whole component of the fraction
	 */
	public Fraction(int whole) {
		this(whole, 0, 1);
	}
	
	/**
	 * Creates a Fraction object of 0/1
	 */
	public Fraction() {
		this(0,0,1);
	}
	
	// ------------------------------------------------- get/set methods
	/**
	 * Sets the numerator for this Fraction object
	 * @param num Assigned numerator for this Fraction object
	 */
	public void setNumerator(int num) {
		numerator = num;
	}
	
	/**
	 * Returns the numerator of this Fraction object
	 * @return numerator value
	 */
	public int getNumerator() {
		return numerator;
	}
	/**
	 * Sets the denominator for this Fraction object
	 * @param denom Assigned denominator for this Fraction object
	 */
	public void setDenominator(int denom) {
		if (denom == 0) {
			denom = 1;
		}
		denominator = denom;
	}
	
	/**
	 * Returns the denominator of this fraction object
	 * @return denominator value
	 */
	public int getDenominator() {
		return denominator;
	}
	
	/**
	 * Sets the whole fraction component
	 * @param whole Assigned value for whole part of this Fraction
	 */
	public void setInteger (int whole) {
		intPart = whole;
	}
	/**
	 * Returns a whole fraction component
	 * @return value of whole part of this Fraction
	 */
	public int getInteger () {
		return intPart;
	}
	
	
	// ------------------------------------------------- public methods
	
	/**
	 * Returns a string representation of the object.
	 */
	public String toString() {
		return ((getInteger()==0)&&(getNumerator()==0))?"0":((getInteger()==0)?"":getInteger()+ " ") + ((getNumerator() == 0)?"":(getNumerator() + "/" + getDenominator()));
	}
	
	/**
	 * Returns decimal format of the fraction object
	 * @return decimal of the fraction
	 */
	//----------------------------------------
	public double toDecimal() {
		return (double) getNumerator() / getDenominator() + getInteger();
	}
	
	
	//-----------------------------------------
	/**
	 * Returns the sum of this Fraction and the argument fractionToAdd
	 * @param fractionToAdd Fraction object which is used to add to this Fraction object
	 * @return sum of two fractions
	 */
	public Fraction add(Fraction fractionToAdd) {
		
		int a,b,c,d,in1,in2;
		
		// isolating the numerator and denominators of the two fraction objects
		a = getNumerator();
		b = getDenominator();
		c = fractionToAdd.getNumerator();
		d = fractionToAdd.getDenominator();
		in1 = getInteger();
		in2 = fractionToAdd.getInteger();
		
		// calculate the new numerator and denominator of the sum of the two fractions
		int newNumerator = (a * d) + (c * b);
		int newDenominator = (b * d);
		int newInt = in1 + in2;
		// construct a new Fraction object that is the sum!
		Fraction sum = new Fraction(newInt,newNumerator, newDenominator);
		
		return sum;			
	}
	
	// ----------------------------------------
	/**
	 * Returns the sum of this Fraction and the argument integer number.
	 * @param number Integer number
	 * @return sum of fraction and integer
	 */
	
	public Fraction add(int number) {
		Fraction myFraction = new Fraction(number, 1);
		Fraction sum = this.add(myFraction);
		return sum;
	}
	//-------------------------------------------
	/**
	 * Returns simplified Fraction of this Fraction
	 * @return simplified fraction
	 */
	public Fraction simplify () {
		
		int myNom = numerator, myDenom = denominator;
		int myIntPart = intPart;
		
		if (myNom >= myDenom) {
			myIntPart = myIntPart + myNom / myDenom;
			myNom = myNom % myDenom;
		}
		
		for (int i = myNom; i > 1; i--) {
			
			if ((myDenom % i == 0) && (myNom % i == 0)) {
				myNom = myNom / i;
				myDenom = myDenom / i;
				break;
			}
		}
		Fraction temp = new Fraction (myIntPart, myNom,myDenom);
		return temp;
	}

}





