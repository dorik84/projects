package tools;

import java.awt.Color;
import javax.swing.BorderFactory;
import javax.swing.JTextField;

/**
* This class creates a validation object that can be associated with any JTextField.
* JTextField text is checked for regular expression matching. If the text does not match the regular expression,
 *it returns a boolean and turns the JTextField border into red.
 * @author dorik
 *
 */

public class TextFieldValidator {

	String regExp;
	Color errorColor;
	JTextField target;

	//---------------------------------constructor
	/**
	 * Constructor of TextFieldValidator with default values of regular expression: "\\w", warning color: red, JTextField is null
	 */
	public TextFieldValidator () {	
		regExp  = "\\w";
		errorColor = Color.RED;
		target = null;
	}
	/**
	 * Constructor of TextFieldValidator object specifying JTextField object
	 * @param myTarget is a JTextField that is associated with this object for validation
	 */
	public TextFieldValidator(JTextField myTarget){
		setTarget(myTarget);
		errorColor = Color.RED;
		regExp  = "\\w";
	}
	/**
	 * Constructor of TextFieldValidator object specifying JTextField object and Color
	 * @param myTarget is a JTextField that is associated with this object for validation
	 * @param myErrorColor - a Color object that determines the border color in case the validation fails
	 */
	public TextFieldValidator(JTextField myTarget,  Color myErrorColor) {
		setTarget(myTarget);
		setErrorColor(myErrorColor);
		regExp  = "\\w";
	}
	
	/**
	 * Setting a regular expression for the TextFieldValidator object
	 * @param myRegExp is a regular expression for checking JTextField text
	 */
	
	//---------------------------------------get / set functions
	public void setRegExp(String  myRegExp) {
		regExp = myRegExp;
	}
	
	/**
	 * Setting a warning color 
	 * @param myColor is a warning color in case if the validation fails
	 */
	public void setErrorColor(Color myColor) {
		errorColor = myColor;
	}
	
	/**
	 * setting a JTextField for validation
	 * @param myTarget is a JTextField that is associated with this object for validation
	 */
	public void setTarget(JTextField myTarget) {
		target = myTarget;
	}
	
	/**
	 * The method validates target JTextField against the regular expression. It changes target border color in errorColor
	 * @return boolean
	 */
	
	//---------------------------------------public functions
	public boolean check() {
		target.setBorder(BorderFactory.createEtchedBorder());
		boolean isValid = target.getText().matches(regExp);
		if (!isValid) {
			target.setBorder(BorderFactory.createLineBorder(errorColor));	
		} 
		return isValid;
	}
	
	/**
	 * The method resets value of border color to default and cleans value of the target 
	 */
	
	public void reset() {
		target.setBorder(BorderFactory.createEtchedBorder());
		target.setText("");
	}
	
	//---------------------------------------main function
	public static void main(String[] args) {

		String str = new String ("0");
		String regExp  = "\\d";
		System.out.println(str.matches(regExp));
	}
}
