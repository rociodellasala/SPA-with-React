package ar.edu.itba.paw.services;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.util.Locale;

import javax.mail.Message;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring4.SpringTemplateEngine;

import ar.edu.itba.paw.interfaces.MailService;
import ar.edu.itba.paw.models.Mail;
import ar.edu.itba.paw.models.User;

@Service()
public class MailServiceImpl implements MailService {
	
	private static final String CONTACT = "Contact";
	private static final String MAILFROM = "MailFrom";
	private static final String EMAIL = "Email";
	private static final String FOLLOWMESSAGE = "FollowMessage";
	private static final String MESSAGE = "Message";
	private static final String PROPERTY = "Property:";
	private static final String PROPERTYTILE = "PropertyTitle";
	
	private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);
	
    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private SpringMessageServiceImpl sms;
    
    @Autowired
    private UserServiceImpl us;
    
    @Autowired
    private RequestServiceImpl rs;
    
    @Autowired
	private SpringTemplateEngine engine;
    
    private Locale locale = LocaleContextHolder.getLocale();
 
    public void sendEmail(Mail mail) {
    	SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mail.getMailFrom());
        message.setTo(mail.getMailTo());
        message.setText(mail.getMailContent());
        mailSender.send(message);
    }
    
    @Override
    public String getHTML() throws MalformedURLException, IOException {
        File initialFile = new File("../webapp/src/main/webapp/resources/html/Mail.html");
        InputStream targetStream = FileUtils.openInputStream(initialFile);
    	String htmlFile = IOUtils.toString(targetStream);
    	IOUtils.closeQuietly(targetStream);
    	return htmlFile;
    }
    

    @Override
	public String prepareMessage(String message, String email, String info, String languaje) {
    	String html = null;
		try {
			html = getHTML();
		} catch (Exception e) {
			LOGGER.trace("Error parsing email");
			return html;
		}

		sms.setLocale(rs.getLocale(languaje));
		html = html.replaceAll(CONTACT, sms.get("mail.contact"));
		html = html.replaceAll(MAILFROM, sms.get("mail.mailFrom"));
		html = html.replaceAll(EMAIL, email);
		html = html.replaceAll(FOLLOWMESSAGE, sms.get("mail.followMessage"));
		html = html.replaceAll(MESSAGE, message);
		html = html.replaceAll(PROPERTY, sms.get("mail.property"));
		html = html.replaceAll(PROPERTYTILE, info);
		return html;
	}
	
    @Override
	public void sendEmail (String to,String from, String body, String info){
    	
		User user = us.findByUsername(to);
		
		//String message = prepareMessage(body,from, info, user.getLanguaje());

		MimeMessage email = mailSender.createMimeMessage();
		sms.setLocale(rs.getLocale(user.getLanguaje()));
		Context context = new Context(locale);
		//context.setVariable("contact", sms.get("mail.contact"));
		//context.setVariable("mailFrom", sms.get("mailFrom"));
//		context.setVariable("email", from);
//		context.setVariable("message", body);
		//context.setVariable("followMessage", sms.get("mail.followMessage"));
		//context.setVariable("property",sms.get("mail.property"));
		//context.setVariable("propertyTitle", info);
		
		String message = engine.process("mailContent", context);
		
		try {
			email.setSubject("Contact message");
			email.setRecipient(Message.RecipientType.TO, new InternetAddress(to));
			email.setContent(message, "text/html; charset=utf-8");
		} catch (Exception e) {
			LOGGER.trace("Error sending email");
			return;
		}

		
		mailSender.send(email);
		LOGGER.trace("Sending email to {} from {} ", to, from);
	}
 
}