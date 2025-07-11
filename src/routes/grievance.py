from flask import Blueprint, request, jsonify
from flask_mail import Mail, Message
from flask import current_app
import datetime

grievance_bp = Blueprint('grievance', __name__)

@grievance_bp.route('/submit-grievance', methods=['POST'])
def submit_grievance():
    try:
        data = request.get_json()
        
        # Extract form data
        title = data.get('title', '')
        description = data.get('description', '')
        mood = data.get('mood', '')
        severity = data.get('severity', 'Medium')
        
        # Validate required fields
        if not title or not description:
            return jsonify({'error': 'Title and description are required'}), 400
        
        # Create email message
        mail = current_app.extensions.get('mail')
        if not mail:
            return jsonify({'error': 'Email service not configured'}), 500
            
        msg = Message(
            subject=f"Grievance from Tanishka: {title}",
            sender=current_app.config['MAIL_DEFAULT_SENDER'],
            recipients=['manasxlevi@gmail.com']
        )
        
        # Create email body
        email_body = f"""
Dear Manas,

Tanishka has submitted a new grievance through the Grievance Portal.

Details:
---------
Title: {title}
Description: {description}
Mood: {mood}
Severity: {severity}
Submitted on: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Please review and respond to Tanishka's concern.

Best regards,
Grievance Portal System
        """
        
        msg.body = email_body
        
        # Send email
        mail.send(msg)
        
        return jsonify({
            'success': True,
            'message': 'Your grievance has been submitted successfully! Manas will get back to you soon.'
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to submit grievance: {str(e)}'}), 500

