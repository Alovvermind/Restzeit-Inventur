"""Database models for the spiritual self-reflection application."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean

def create_models(db):
    """Create database models with the given db instance."""
    
    class ReflectionSession(db.Model):
        """Model for storing user reflection sessions and analyses."""
        __tablename__ = 'reflection_sessions'
        
        id = Column(Integer, primary_key=True)
        user_text = Column(Text, nullable=False)
        ai_analysis = Column(Text, nullable=False)
        timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
        user_ip = Column(String(45))  # Support IPv6
        user_agent = Column(String(500))
        session_id = Column(String(255))
        is_successful = Column(Boolean, default=True)
        
        def to_dict(self):
            """Convert to dictionary for JSON serialization."""
            return {
                'id': self.id,
                'user_text': self.user_text,
                'ai_analysis': self.ai_analysis,
                'timestamp': self.timestamp.isoformat(),
                'is_successful': self.is_successful
            }
        
        def __repr__(self):
            return f'<ReflectionSession {self.id}>'

    class AppUsage(db.Model):
        """Model for tracking application usage statistics."""
        __tablename__ = 'app_usage'
        
        id = Column(Integer, primary_key=True)
        date = Column(DateTime, default=datetime.utcnow, nullable=False)
        total_sessions = Column(Integer, default=0)
        successful_sessions = Column(Integer, default=0)
        failed_sessions = Column(Integer, default=0)
        unique_visitors = Column(Integer, default=0)
        
        def __repr__(self):
            return f'<AppUsage {self.date.date()}>'
    
    return ReflectionSession, AppUsage