#Entity Relationship Diagram (ERD)

**Entities**
Users

**Attributes:**

user_id (PK)
name
email
password
role
Items

**Attributes:**

item_id (PK)
title
description
category
location
status
created_at
user_id (FK)
Claims

**Attributes:**

claim_id (PK)
item_id (FK)
user_id (FK)
status

**Relationships**

**Users**
(1 → Many)
Items

**Items**
(1 → Many)
Claims

**Users**
(1 → Many)
Claims

**Text Representation:**

Users
↓

Items
↓

Claims
