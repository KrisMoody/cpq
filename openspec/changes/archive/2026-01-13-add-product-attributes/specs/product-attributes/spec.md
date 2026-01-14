## ADDED Requirements

### Requirement: Attribute Definition
The system SHALL support defining reusable product attributes.

#### Scenario: Create attribute
- **WHEN** user creates an attribute
- **THEN** it has a name, code, and type
- **AND** type can be: TEXT, NUMBER, BOOLEAN, SELECT, DATE

#### Scenario: Select attribute options
- **WHEN** attribute type is SELECT
- **THEN** predefined options are specified
- **AND** options have label and value

#### Scenario: Attribute validation
- **WHEN** attribute has constraints
- **THEN** they are enforced (e.g., min/max for NUMBER)
- **AND** required flag can be set

#### Scenario: Attribute grouping
- **WHEN** attributes are created
- **THEN** they can be assigned to groups for organization
- **AND** groups help categorize related attributes (e.g., "Physical", "Technical")

### Requirement: Product Attribute Assignment
The system SHALL allow products to have attribute values.

#### Scenario: Set attribute value
- **WHEN** user edits a product
- **THEN** user can set values for defined attributes
- **AND** values are validated against attribute type/constraints

#### Scenario: Multiple attributes
- **WHEN** product has multiple attributes
- **THEN** all values are stored and displayed
- **AND** attributes are grouped logically

#### Scenario: Category-level attributes
- **WHEN** attributes are associated with a category
- **THEN** all products in that category can have those attributes
- **AND** attributes are suggested when editing products in the category

### Requirement: Attribute Display
The system SHALL display product attributes clearly.

#### Scenario: Product detail attributes
- **WHEN** viewing product details
- **THEN** attributes are shown in organized sections
- **AND** grouped by attribute group

#### Scenario: Product card attributes
- **WHEN** viewing product in list/card view
- **THEN** key attributes can be shown as badges or labels

#### Scenario: Quote line item attributes
- **WHEN** product is on a quote
- **THEN** important attributes are visible on line item
- **AND** helps distinguish similar products

### Requirement: Attribute-Based Filtering
The system SHALL support filtering products by attribute values.

#### Scenario: Filter by attribute
- **WHEN** user filters products
- **THEN** can filter by attribute values (e.g., color = "Red")
- **AND** multiple attribute filters can be combined

#### Scenario: Range filtering
- **WHEN** attribute is NUMBER type
- **THEN** filter supports range queries (e.g., weight 1-5 kg)

#### Scenario: Attribute search
- **WHEN** searching products
- **THEN** attribute values are included in search

### Requirement: Attribute-Based Rules
The system SHALL support rules based on product attributes.

#### Scenario: Attribute condition in rule
- **WHEN** creating a rule
- **THEN** conditions can reference product attributes
- **AND** example: "IF product.warranty > 24 months THEN require approval"

#### Scenario: Attribute-based pricing
- **WHEN** attribute affects pricing
- **THEN** rules can apply discounts/markups based on attributes
- **AND** example: "IF color = 'Custom' THEN add 10%"

### Requirement: Attribute Management UI
The system SHALL provide interfaces for managing attributes.

#### Scenario: List attributes
- **WHEN** user navigates to attributes page
- **THEN** all attributes listed with name, type, usage count

#### Scenario: Create attribute
- **WHEN** user creates attribute
- **THEN** specify name, code, type
- **AND** configure type-specific settings (options for SELECT, constraints for NUMBER)

#### Scenario: Edit attribute
- **WHEN** user edits attribute
- **THEN** can modify name, add options (SELECT)
- **AND** cannot change type if values exist

#### Scenario: Attribute groups
- **WHEN** managing attributes
- **THEN** can create/edit attribute groups
- **AND** assign attributes to groups
