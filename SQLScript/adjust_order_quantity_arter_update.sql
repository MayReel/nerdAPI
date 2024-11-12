DELIMITER //

CREATE TRIGGER adjust_order_quantity_after_update
AFTER UPDATE ON `testing`.`users`
FOR EACH ROW
BEGIN
    DECLARE quantity_difference INT;
    DECLARE current_order_quantity INT;

    -- คำนวณความแตกต่างระหว่างค่าเดิมและค่าใหม่ใน users
    SET quantity_difference = OLD.quantities - NEW.quantities;

    -- ตรวจสอบว่ามีการเปลี่ยนแปลง quantities ใน users และมี order_ID ที่สัมพันธ์กัน
    IF quantity_difference <> 0 AND NEW.order_ID IS NOT NULL THEN
        
        -- ดึงค่า quantities ปัจจุบันใน order ที่สัมพันธ์กับ order_ID ใน users
        SELECT quantities INTO current_order_quantity
        FROM `testing`.`order`
        WHERE order_ID = NEW.order_ID;

        -- ตรวจสอบว่าการเปลี่ยนแปลงจะไม่ทำให้ quantities ใน order ติดลบ
        IF current_order_quantity + quantity_difference < 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Insufficient quantities in order';
        ELSE
            -- อัปเดต quantities ใน order โดยตรงด้วย quantity_difference
            UPDATE `testing`.`order`
            SET quantities = quantities + quantity_difference
            WHERE order_ID = NEW.order_ID;
        END IF;
    END IF;
END //

DELIMITER ;
