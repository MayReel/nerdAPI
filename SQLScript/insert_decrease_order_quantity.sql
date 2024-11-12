DELIMITER //

CREATE TRIGGER insert_decrease_order_quantity
AFTER INSERT ON `testing`.`users`
FOR EACH ROW
BEGIN
    DECLARE new_quantity INT;

    -- ตรวจสอบ quantities ใหม่ที่คำนวณได้
    SELECT quantities - NEW.quantities INTO new_quantity
    FROM `testing`.`order`
    WHERE order_ID = NEW.order_ID;

    -- อัพเดตค่า quantities ในตาราง order ถ้า quantities ใหม่ >= 0
    IF new_quantity >= 0 THEN
        UPDATE `testing`.`order`
        SET quantities = new_quantity
        WHERE order_ID = NEW.order_ID;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Insufficient quantities in order';
    END IF;
END //

DELIMITER ;