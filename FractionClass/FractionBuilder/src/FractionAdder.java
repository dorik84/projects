import javax.swing.JFrame;
import javax.swing.GroupLayout;
import javax.swing.GroupLayout.Alignment;
import javax.swing.JLabel;
import javax.swing.LayoutStyle.ComponentPlacement;
import javax.swing.JPanel;
import javax.swing.border.TitledBorder;

import tools.Fraction;
import tools.TextFieldValidator;

import javax.swing.JTextField;
import javax.swing.JTextArea;
import java.awt.Font;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;

public class FractionAdder {

	private JFrame frame;
	private JTextField txtFirstWhole;
	private JTextField txtSecondWhole;
	private JTextField txtFirstNum;
	private JTextField txtSecondNum;
	private JTextField txtFirstDen;
	private JTextField txtSecondDen;
	private JTextArea txtOutput;
	private int FirstWhole;
	private int SecondWhole;
	private int FirstNum;
	private int SecondNum;
	private int FirstDen;
	private int SecondDen;
	private JTextField input;
	private TextFieldValidator validator;
	private Fraction fraction1;
	private Fraction fraction2;
	
	//-------------------------------------------------constructor method
	public FractionAdder() {
		initialize();
	}


	private void initialize() {

		frame = new JFrame();
		frame.setBounds(100, 100, 471, 300);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		
		JPanel panel = new JPanel();
		panel.setBorder(new TitledBorder(null, "First fraction", TitledBorder.LEADING, TitledBorder.TOP, null, null));
		
		JPanel panel_1 = new JPanel();
		panel_1.setBorder(new TitledBorder(null, "Second fraction", TitledBorder.LEADING, TitledBorder.TOP, null, null));
		
		txtOutput = new JTextArea();
		txtOutput.setEditable(false);
		txtOutput.setFont(new Font("Monospaced", Font.BOLD, 18));
		GroupLayout groupLayout = new GroupLayout(frame.getContentPane());
		groupLayout.setHorizontalGroup(
			groupLayout.createParallelGroup(Alignment.LEADING)
				.addGroup(groupLayout.createSequentialGroup()
					.addContainerGap()
					.addGroup(groupLayout.createParallelGroup(Alignment.TRAILING, false)
						.addComponent(txtOutput, Alignment.LEADING)
						.addGroup(Alignment.LEADING, groupLayout.createSequentialGroup()
							.addComponent(panel, GroupLayout.PREFERRED_SIZE, 205, GroupLayout.PREFERRED_SIZE)
							.addPreferredGap(ComponentPlacement.RELATED)
							.addComponent(panel_1, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE)))
					.addContainerGap(84, Short.MAX_VALUE))
		);
		groupLayout.setVerticalGroup(
			groupLayout.createParallelGroup(Alignment.LEADING)
				.addGroup(groupLayout.createSequentialGroup()
					.addContainerGap()
					.addGroup(groupLayout.createParallelGroup(Alignment.BASELINE)
						.addComponent(panel, GroupLayout.DEFAULT_SIZE, 140, Short.MAX_VALUE)
						.addComponent(panel_1, GroupLayout.PREFERRED_SIZE, 140, GroupLayout.PREFERRED_SIZE))
					.addPreferredGap(ComponentPlacement.RELATED)
					.addComponent(txtOutput, GroupLayout.PREFERRED_SIZE, 93, GroupLayout.PREFERRED_SIZE)
					.addContainerGap())
		);
		
		JLabel label = new JLabel("Whole part");
		
		JLabel label_1 = new JLabel("Numerator");
		
		JLabel label_2 = new JLabel("Denomenator");
		
		txtSecondWhole = new JTextField();
		//-----------------------------------------------------add event listener
		txtSecondWhole.addKeyListener(new KeyAdapter() {
			public void keyReleased(KeyEvent e) {
				onChange(e);
			}
		});
		txtSecondWhole.setColumns(10);
		
		txtSecondNum = new JTextField();
		//-----------------------------------------------------add event listener
		txtSecondNum.addKeyListener(new KeyAdapter() {
			public void keyReleased(KeyEvent e) {
				onChange(e);
			}
		});
		txtSecondNum.setColumns(10);
		
		txtSecondDen = new JTextField();
		//-----------------------------------------------------add event listener
		txtSecondDen.addKeyListener(new KeyAdapter() {
			public void keyReleased(KeyEvent e) {
				onChange(e);
			}
		});
		txtSecondDen.setColumns(10);
		GroupLayout gl_panel_1 = new GroupLayout(panel_1);
		gl_panel_1.setHorizontalGroup(
			gl_panel_1.createParallelGroup(Alignment.LEADING)
				.addGroup(gl_panel_1.createSequentialGroup()
					.addGroup(gl_panel_1.createParallelGroup(Alignment.LEADING)
						.addGroup(gl_panel_1.createSequentialGroup()
							.addGap(22)
							.addGroup(gl_panel_1.createParallelGroup(Alignment.TRAILING)
								.addComponent(label_1)
								.addComponent(label)))
						.addGroup(gl_panel_1.createSequentialGroup()
							.addContainerGap()
							.addComponent(label_2)))
					.addPreferredGap(ComponentPlacement.UNRELATED)
					.addGroup(gl_panel_1.createParallelGroup(Alignment.LEADING, false)
						.addComponent(txtSecondDen, 0, 0, Short.MAX_VALUE)
						.addComponent(txtSecondNum, 0, 0, Short.MAX_VALUE)
						.addComponent(txtSecondWhole, GroupLayout.DEFAULT_SIZE, 74, Short.MAX_VALUE))
					.addContainerGap(32, Short.MAX_VALUE))
		);
		gl_panel_1.setVerticalGroup(
			gl_panel_1.createParallelGroup(Alignment.LEADING)
				.addGroup(gl_panel_1.createSequentialGroup()
					.addContainerGap()
					.addGroup(gl_panel_1.createParallelGroup(Alignment.BASELINE)
						.addComponent(label)
						.addComponent(txtSecondWhole, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE))
					.addGap(18)
					.addGroup(gl_panel_1.createParallelGroup(Alignment.BASELINE)
						.addComponent(label_1)
						.addComponent(txtSecondNum, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE))
					.addGap(18)
					.addGroup(gl_panel_1.createParallelGroup(Alignment.BASELINE)
						.addComponent(txtSecondDen, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE)
						.addComponent(label_2))
					.addContainerGap())
		);
		panel_1.setLayout(gl_panel_1);
		
		JLabel lblNewLabel = new JLabel("Whole part");
		
		JLabel lblNewLabel_1 = new JLabel("Numerator");
		
		JLabel lblNewLabel_2 = new JLabel("Denomenator");
		
		txtFirstWhole = new JTextField();
		//-----------------------------------------------------add event listener
		txtFirstWhole.addKeyListener(new KeyAdapter() {
			public void keyReleased(KeyEvent e) {
				onChange(e);
			}
		});
		txtFirstWhole.setColumns(10);
		
		txtFirstNum = new JTextField();
		//-----------------------------------------------------add event listener
		txtFirstNum.addKeyListener(new KeyAdapter() {
			public void keyReleased(KeyEvent e) {
				onChange(e);
			}
		});
		txtFirstNum.setColumns(10);
		
		txtFirstDen = new JTextField();
		//-----------------------------------------------------add event listener
		txtFirstDen.addKeyListener(new KeyAdapter() {
			public void keyReleased(KeyEvent e) {
				onChange(e);
			}
		});
		txtFirstDen.setColumns(10);
		GroupLayout gl_panel = new GroupLayout(panel);
		gl_panel.setHorizontalGroup(
			gl_panel.createParallelGroup(Alignment.LEADING)
				.addGroup(gl_panel.createSequentialGroup()
					.addGroup(gl_panel.createParallelGroup(Alignment.LEADING, false)
						.addGroup(gl_panel.createSequentialGroup()
							.addGap(10)
							.addComponent(lblNewLabel_2)
							.addPreferredGap(ComponentPlacement.UNRELATED)
							.addComponent(txtFirstDen, 0, 0, Short.MAX_VALUE))
						.addGroup(Alignment.TRAILING, gl_panel.createSequentialGroup()
							.addGap(24)
							.addComponent(lblNewLabel_1)
							.addPreferredGap(ComponentPlacement.UNRELATED)
							.addComponent(txtFirstNum, 0, 0, Short.MAX_VALUE))
						.addGroup(gl_panel.createSequentialGroup()
							.addGap(22)
							.addComponent(lblNewLabel)
							.addPreferredGap(ComponentPlacement.UNRELATED)
							.addComponent(txtFirstWhole, GroupLayout.PREFERRED_SIZE, 78, GroupLayout.PREFERRED_SIZE)))
					.addContainerGap(30, Short.MAX_VALUE))
		);
		gl_panel.setVerticalGroup(
			gl_panel.createParallelGroup(Alignment.LEADING)
				.addGroup(gl_panel.createSequentialGroup()
					.addGap(11)
					.addGroup(gl_panel.createParallelGroup(Alignment.BASELINE)
						.addComponent(lblNewLabel)
						.addComponent(txtFirstWhole, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE))
					.addGap(18)
					.addGroup(gl_panel.createParallelGroup(Alignment.BASELINE)
						.addComponent(lblNewLabel_1)
						.addComponent(txtFirstNum, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE))
					.addGap(18)
					.addGroup(gl_panel.createParallelGroup(Alignment.BASELINE)
						.addComponent(lblNewLabel_2)
						.addComponent(txtFirstDen, GroupLayout.PREFERRED_SIZE, GroupLayout.DEFAULT_SIZE, GroupLayout.PREFERRED_SIZE)))
		);
		panel.setLayout(gl_panel);
		frame.getContentPane().setLayout(groupLayout);
	}
	
	//----------------------------------------------------event handler
	public void onChange(KeyEvent e) {
		txtOutput.setText("");
		input = (JTextField)e.getSource();
		validator = new TextFieldValidator(input);
		validator.setRegExp("\\d*");
		
		if (validator.check()) {
			
			FirstWhole = Integer.parseInt((txtFirstWhole.getText().equals(""))?"0":txtFirstWhole.getText());
			SecondWhole =  Integer.parseInt((txtSecondWhole.getText().equals(""))?"0":txtSecondWhole.getText());
			FirstNum =  Integer.parseInt((txtFirstNum.getText().equals(""))?"0":txtFirstNum.getText());
			SecondNum =  Integer.parseInt((txtSecondNum.getText().equals(""))?"0":txtSecondNum.getText());
			FirstDen =  Integer.parseInt((txtFirstDen.getText().equals(""))?"0":txtFirstDen.getText());
			SecondDen =  Integer.parseInt((txtSecondDen.getText().equals(""))?"0":txtSecondDen.getText());
			
			fraction1 = new Fraction(FirstWhole, FirstNum, FirstDen);
			fraction2 = new Fraction(SecondWhole, SecondNum, SecondDen);
			
			txtOutput.setText(fraction1.add(fraction2).simplify().toString());
		};
	}
	
//---------------------------------------------------------main function
	public static void main(String[] args) {
		FractionAdder window = new FractionAdder();
		window.frame.setVisible(true);
	}
}
