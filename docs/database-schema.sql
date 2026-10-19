-- ============================================
-- GPAA Website Database Schema
-- Ghana Physician Assistants Association
-- ============================================

-- ============================================
-- ADMIN USERS (Internal Use Only - No Public Authentication)
-- ============================================
-- This table is for internal admin tracking only
-- Public users do not have accounts or login functionality

CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);


-- ============================================
-- MEMBERSHIP MANAGEMENT
-- ============================================

CREATE TABLE membership_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    fees DECIMAL(10, 2) NOT NULL,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE membership_category_benefits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    benefit TEXT NOT NULL,
    display_order INT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES membership_categories(id) ON DELETE CASCADE
);

CREATE TABLE members (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    date_of_birth DATE,
    
    -- Professional Information
    license_number VARCHAR(50) UNIQUE NOT NULL,
    staff_id VARCHAR(50),
    employer VARCHAR(255),
    institution VARCHAR(255),
    workplace VARCHAR(255),
    
    -- Location
    region VARCHAR(100),
    district VARCHAR(100),
    address TEXT,
    
    -- Membership Status
    membership_status ENUM('pending', 'active', 'inactive', 'suspended', 'expired') DEFAULT 'pending',
    membership_start_date DATE,
    membership_expiry_date DATE,
    
    -- Timestamps
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    approved_by_admin INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES membership_categories(id),
    FOREIGN KEY (approved_by_admin) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_license (license_number),
    INDEX idx_email (email),
    INDEX idx_status (membership_status),
    INDEX idx_region (region),
    INDEX idx_expiry (membership_expiry_date)
);


-- ============================================
-- NEWS & ARTICLES
-- ============================================

CREATE TABLE news_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news_articles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content LONGTEXT,
    image VARCHAR(500),
    author_name VARCHAR(255),
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Publishing
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES news_categories(id),
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_published (published_at),
    INDEX idx_featured (is_featured),
    FULLTEXT idx_search (title, description, content)
);


-- ============================================
-- EVENTS MANAGEMENT
-- ============================================

CREATE TABLE events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content LONGTEXT,
    image VARCHAR(500),
    
    -- Event Details
    event_date DATE NOT NULL,
    event_time TIME,
    end_date DATE,
    location VARCHAR(255),
    venue VARCHAR(255),
    capacity INT,
    registration_deadline DATE,
    
    -- Event Type
    type ENUM('conference', 'workshop', 'seminar', 'webinar', 'training', 'networking', 'other') NOT NULL,
    status ENUM('upcoming', 'ongoing', 'past', 'cancelled') DEFAULT 'upcoming',
    
    -- Registration
    requires_registration BOOLEAN DEFAULT TRUE,
    registration_fee DECIMAL(10, 2) DEFAULT 0,
    registration_link VARCHAR(500),
    
    -- Metadata
    organizer VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_date (event_date),
    INDEX idx_type (type),
    INDEX idx_status (status),
    FULLTEXT idx_search (title, description, location)
);

CREATE TABLE event_registrations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_id BIGINT NOT NULL,
    member_id BIGINT,
    
    -- Registration Details
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    organization VARCHAR(255),
    
    -- Status
    status ENUM('pending', 'confirmed', 'cancelled', 'attended') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
    INDEX idx_event (event_id),
    INDEX idx_email (email),
    INDEX idx_status (status)
);


-- ============================================
-- PROGRAMS & CPD
-- ============================================

CREATE TABLE program_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE programs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content LONGTEXT,
    image VARCHAR(500),
    icon VARCHAR(100),
    
    -- Program Details
    duration VARCHAR(100),
    level ENUM('beginner', 'intermediate', 'advanced', 'all'),
    cpd_hours DECIMAL(5, 2),
    
    -- Status
    status ENUM('active', 'inactive', 'completed') DEFAULT 'active',
    is_featured BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES program_categories(id),
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured)
);

CREATE TABLE program_enrollments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    program_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    
    status ENUM('enrolled', 'in_progress', 'completed', 'dropped') DEFAULT 'enrolled',
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_program (program_id),
    INDEX idx_member (member_id),
    INDEX idx_status (status)
);


-- ============================================
-- CAREERS & JOB POSTINGS
-- ============================================

CREATE TABLE job_postings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    
    -- Job Details
    type ENUM('full-time', 'part-time', 'contract', 'internship', 'volunteer') NOT NULL,
    department VARCHAR(100),
    location VARCHAR(255) NOT NULL,
    salary_range VARCHAR(100),
    
    -- Description
    description TEXT NOT NULL,
    responsibilities TEXT,
    requirements TEXT,
    benefits TEXT,
    
    -- Application
    application_deadline DATE,
    application_email VARCHAR(255),
    application_link VARCHAR(500),
    
    -- Status
    status ENUM('open', 'closed', 'filled') DEFAULT 'open',
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    views_count INT DEFAULT 0,
    applications_count INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_deadline (application_deadline),
    FULLTEXT idx_search (title, description, location)
);

CREATE TABLE job_applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    job_id BIGINT NOT NULL,
    member_id BIGINT,
    
    -- Applicant Details
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Application Materials
    resume_url VARCHAR(500),
    cover_letter TEXT,
    portfolio_url VARCHAR(500),
    
    -- Status
    status ENUM('submitted', 'under_review', 'shortlisted', 'interview', 'rejected', 'accepted') DEFAULT 'submitted',
    
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by_admin INT,
    notes TEXT,
    
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
    FOREIGN KEY (reviewed_by_admin) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_job (job_id),
    INDEX idx_email (email),
    INDEX idx_status (status)
);


-- ============================================
-- CONTACT & INQUIRIES
-- ============================================

CREATE TABLE contact_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Status
    status ENUM('new', 'in_progress', 'resolved', 'closed') DEFAULT 'new',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    
    -- Assignment
    assigned_to_admin INT,
    response TEXT,
    responded_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (assigned_to_admin) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_email (email),
    INDEX idx_priority (priority),
    INDEX idx_created (created_at)
);


-- ============================================
-- VOLUNTEERS
-- ============================================

CREATE TABLE volunteer_areas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(20),
    requirements TEXT,
    time_commitment VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE volunteer_applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    area_id INT NOT NULL,
    member_id BIGINT,
    
    -- Applicant Details
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Availability & Experience
    availability TEXT,
    experience TEXT,
    message TEXT,
    
    -- Status
    status ENUM('pending', 'approved', 'rejected', 'active', 'inactive') DEFAULT 'pending',
    
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by_admin INT,
    notes TEXT,
    
    FOREIGN KEY (area_id) REFERENCES volunteer_areas(id),
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
    FOREIGN KEY (reviewed_by_admin) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_area (area_id),
    INDEX idx_status (status),
    INDEX idx_email (email)
);


-- ============================================
-- DONATIONS
-- ============================================

CREATE TABLE donation_campaigns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_amount DECIMAL(12, 2),
    current_amount DECIMAL(12, 2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE donations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT,
    member_id BIGINT,
    
    -- Donor Details
    donor_name VARCHAR(255),
    donor_email VARCHAR(255) NOT NULL,
    donor_phone VARCHAR(20),
    is_anonymous BOOLEAN DEFAULT FALSE,
    
    -- Donation Details
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'GHS',
    donation_type ENUM('one-time', 'monthly', 'quarterly', 'annual') DEFAULT 'one-time',
    
    -- Payment Details
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    
    -- Tax Receipt
    receipt_number VARCHAR(50) UNIQUE,
    receipt_sent BOOLEAN DEFAULT FALSE,
    
    donated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    
    FOREIGN KEY (campaign_id) REFERENCES donation_campaigns(id) ON DELETE SET NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
    INDEX idx_email (donor_email),
    INDEX idx_status (payment_status),
    INDEX idx_date (donated_at),
    INDEX idx_campaign (campaign_id)
);


-- ============================================
-- PARTNERSHIPS
-- ============================================

CREATE TABLE partners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo VARCHAR(500),
    description TEXT,
    website VARCHAR(500),
    
    -- Partnership Details
    type ENUM('institutional', 'corporate', 'academic', 'government', 'ngo', 'other') NOT NULL,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    partnership_start_date DATE,
    
    -- Contact
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_type (type),
    INDEX idx_status (status)
);


-- ============================================
-- EXECUTIVES & LEADERSHIP
-- ============================================

CREATE TABLE executive_positions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    level INT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE executives (
    id INT PRIMARY KEY AUTO_INCREMENT,
    position_id INT NOT NULL,
    member_id BIGINT,
    
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    image VARCHAR(500),
    bio TEXT,
    
    -- Term
    term_start_date DATE,
    term_end_date DATE,
    is_current BOOLEAN DEFAULT TRUE,
    
    display_order INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (position_id) REFERENCES executive_positions(id),
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
    INDEX idx_current (is_current),
    INDEX idx_position (position_id)
);


-- ============================================
-- HISTORY & MILESTONES
-- ============================================

CREATE TABLE history_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    year VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500),
    category ENUM('founding', 'milestone', 'achievement', 'expansion', 'other') DEFAULT 'milestone',
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_year (year),
    INDEX idx_category (category)
);


-- ============================================
-- RESOURCES & DOCUMENTS
-- ============================================

CREATE TABLE resource_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    parent_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES resource_categories(id) ON DELETE SET NULL
);

CREATE TABLE resources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    
    -- Resource Details
    type ENUM('document', 'guideline', 'policy', 'form', 'template', 'publication', 'other') NOT NULL,
    file_url VARCHAR(500),
    file_size BIGINT,
    file_type VARCHAR(50),
    
    -- Access Control
    access_level ENUM('public', 'members', 'restricted') DEFAULT 'public',
    
    -- Metadata
    author VARCHAR(255),
    published_date DATE,
    version VARCHAR(20),
    
    -- Tracking
    downloads_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES resource_categories(id),
    INDEX idx_slug (slug),
    INDEX idx_type (type),
    INDEX idx_access (access_level),
    FULLTEXT idx_search (title, description)
);


-- ============================================
-- CONFERENCE ARCHIVE
-- ============================================

CREATE TABLE conferences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    year INT NOT NULL,
    location VARCHAR(255),
    
    start_date DATE,
    end_date DATE,
    theme VARCHAR(255),
    
    -- Media
    image VARCHAR(500),
    venue_image VARCHAR(500),
    highlights TEXT,
    
    -- Attendance
    total_participants INT,
    total_speakers INT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_slug (slug),
    INDEX idx_year (year)
);

CREATE TABLE conference_materials (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    conference_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('presentation', 'abstract', 'poster', 'photo', 'video', 'report', 'other') NOT NULL,
    file_url VARCHAR(500),
    thumbnail VARCHAR(500),
    author VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conference_id) REFERENCES conferences(id) ON DELETE CASCADE,
    INDEX idx_conference (conference_id),
    INDEX idx_type (type)
);


-- ============================================
-- SETTINGS & CONFIGURATION
-- ============================================

CREATE TABLE site_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by_admin INT,
    FOREIGN KEY (updated_by_admin) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_key (setting_key)
);


-- ============================================
-- NOTIFICATIONS & MESSAGING
-- ============================================
-- Note: Without authentication, notifications are sent via email only
-- This table can track email notifications sent to members

CREATE TABLE email_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    variables TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE email_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    template_id INT,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT,
    status ENUM('pending', 'sent', 'failed', 'bounced') DEFAULT 'pending',
    error_message TEXT,
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL,
    INDEX idx_recipient (recipient_email),
    INDEX idx_status (status),
    INDEX idx_sent (sent_at)
);


-- ============================================
-- AUDIT LOGS
-- ============================================

CREATE TABLE audit_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT,
    
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT,
    
    old_values JSON,
    new_values JSON,
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE SET NULL,
    INDEX idx_admin (admin_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
);


-- ============================================
-- INITIAL DATA SEEDING
-- ============================================

-- Insert default news categories
INSERT INTO news_categories (name, slug, description, color) VALUES
('Announcements', 'announcements', 'Official GPAA announcements and updates', '#3B82F6'),
('Events', 'events', 'Upcoming and past events coverage', '#10B981'),
('CPD', 'cpd', 'Continuing Professional Development updates', '#8B5CF6'),
('Advocacy', 'advocacy', 'Legislative and policy advocacy news', '#F59E0B'),
('Community', 'community', 'Community health and outreach initiatives', '#EC4899'),
('Research', 'research', 'Research publications and findings', '#06B6D4');

-- Insert default program categories
INSERT INTO program_categories (name, slug, description, icon) VALUES
('Clinical Skills', 'clinical-skills', 'Clinical practice and skills development', 'medical_services'),
('Leadership', 'leadership', 'Leadership and management training', 'workspace_premium'),
('Research', 'research', 'Research methodology and publication', 'science'),
('Public Health', 'public-health', 'Public health and community programs', 'health_and_safety');

-- Insert default volunteer areas
INSERT INTO volunteer_areas (title, description, icon, color, requirements, time_commitment) VALUES
('Community Health Outreach', 'Participate in health screening programs and community engagement', 'health_and_safety', 'blue', 'Active PA/Medical background, Weekend availability', '4-8 hours/month'),
('CPD Program Support', 'Assist in organizing training workshops and sessions', 'school', 'green', 'Relevant expertise, Teaching experience', '4-8 hours/month'),
('Advocacy & Policy', 'Support legislative advocacy and policy research', 'gavel', 'purple', 'Research skills, Policy interest', 'Flexible'),
('Event Coordination', 'Help organize conferences and GPAA events', 'event', 'orange', 'Organizational skills, Team player', 'Event-based'),
('Digital & Communications', 'Contribute to social media and content creation', 'campaign', 'pink', 'Digital literacy, Creative mindset', 'Flexible'),
('Mentorship Program', 'Guide newly qualified PAs through professional development', 'diversity_3', 'indigo', '5+ years experience, Leadership qualities', 'Ongoing');

-- Insert default executive positions
INSERT INTO executive_positions (title, description, level, display_order) VALUES
('President', 'Chief executive officer of GPAA', 1, 1),
('Vice President', 'Deputy to the President', 2, 2),
('General Secretary', 'Administrative head', 2, 3),
('Treasurer', 'Financial management', 2, 4),
('National Organizer', 'Coordination and organization', 3, 5),
('Public Relations Officer', 'Communication and media relations', 3, 6);

-- Insert default admin user (for internal management)
INSERT INTO admin_users (name, email, notes, is_active) VALUES
('System Administrator', 'admin@gpaa.org.gh', 'Default admin account for system management', TRUE);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('site_name', 'Ghana Physician Assistants Association', 'string', 'Website name', TRUE),
('contact_email', 'info@gpaa.org.gh', 'string', 'General contact email', TRUE),
('contact_phone', '+233 XXX XXX XXX', 'string', 'General contact phone', TRUE),
('office_address', 'Accra, Ghana', 'string', 'Office location', TRUE),
('membership_fee_currency', 'GHS', 'string', 'Currency for membership fees', TRUE),
('enable_online_registration', 'true', 'boolean', 'Allow online membership registration', FALSE),
('enable_donations', 'true', 'boolean', 'Enable donation functionality', FALSE);
