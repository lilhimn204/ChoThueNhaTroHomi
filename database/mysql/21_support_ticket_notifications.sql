USE rental_room_db;

-- Allow in-app notifications for tickets submitted to the "Ho tro Homi" admin area.
ALTER TABLE notifications
    MODIFY type ENUM('NEW_CONTACT_REQUEST', 'NEW_SUPPORT_TICKET') NOT NULL;
