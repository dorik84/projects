package tools;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class FractionClassTest {

	private static Fraction f1;
	private static Fraction f2;
	
	@BeforeAll
	static void setUpBeforeClass() throws Exception {
		f1 = new Fraction(46,8);
		f2 = new Fraction(64,64);
	}

	@AfterAll
	static void tearDownAfterClass() throws Exception {
		
	}

	@Test
	void testConstructor() {
		assertEquals(5.5, new Fraction(5, 1, 2).toDecimal());
		assertEquals(3.6, new Fraction(3, 12, 20).toDecimal());
		assertEquals(0.375, new Fraction(3, 8).toDecimal());
		assertEquals(0.9, new Fraction(9, 10).toDecimal());
		assertEquals(34, new Fraction(34).toDecimal());
		assertEquals(2, new Fraction(2).toDecimal());
	}
	
	@Test
	void testToString() {
		assertEquals("5 1/2", new Fraction(5, 1, 2).toString());
		assertEquals("3 12/20", new Fraction(3, 12, 20).toString());
		assertEquals("3/8", new Fraction(3, 8).toString());
		assertEquals("9/10", new Fraction(9, 10).toString());
		assertEquals("34 ", new Fraction(34).toString());
		assertEquals("2 ", new Fraction(2).toString());
	}
	
	@Test
	void testToDecimal() {
		assertEquals(0.75, (new Fraction(3,4).toDecimal()), 0);
		assertEquals(0.5, (new Fraction(1,2).toDecimal()), 0);
		assertEquals(6.0, (new Fraction(6).toDecimal()), 0);
		assertEquals(0, (new Fraction().toDecimal()), 0);
	}
	
	@Test
	void testAdd() {
		assertEquals("5 6/8", (new Fraction(5, 1, 4).add(new Fraction (1,2))).toString());
		assertEquals("64/64", (new Fraction(7, 8).add(new Fraction (1,8))).toString());
		assertEquals("8 7/8", (new Fraction(7, 8).add(new Fraction (8))).toString());
		assertEquals("2/19", (new Fraction(2, 19).add(new Fraction ())).toString());
		
		assertEquals(5.75, (new Fraction(5, 1, 4).add(new Fraction (1,2))).toDecimal());
		assertEquals(1, (new Fraction(7, 8).add(new Fraction (1,8))).toDecimal());
		assertEquals(8.875, (new Fraction(7, 8).add(new Fraction (8))).toDecimal());
		assertEquals(0.2, (new Fraction(2, 10).add(new Fraction ())).toDecimal());
	}
	
	@Test
	void testSimplify() {
		assertEquals("5 3/4",f1.simplify().toString());
		assertEquals(1,f2.toDecimal());
	}

}



