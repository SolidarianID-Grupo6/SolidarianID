// cypher-shell -u <username> -p <password> -f load-test-data.cypher
// Create Users with realistic names and UUIDs
WITH [
  'John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Chris', 'Jessica', 'Daniel', 'Laura',
  'James', 'Mary', 'Robert', 'Patricia', 'William', 'Linda', 'Joseph', 'Barbara', 'Charles', 'Susan',
  'Thomas', 'Margaret', 'Christopher', 'Lisa', 'Matthew', 'Nancy', 'Anthony', 'Karen', 'Mark', 'Betty',
  'Donald', 'Helen', 'Steven', 'Sandra', 'Paul', 'Donna', 'Andrew', 'Carol', 'Joshua', 'Ruth',
  'Kenneth', 'Sharon', 'Kevin', 'Michelle', 'Brian', 'Laura', 'George', 'Sarah', 'Edward', 'Kimberly'
] AS firstNames
WITH firstNames, [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
] AS lastNames
UNWIND range(1, 1000) AS id
WITH apoc.create.uuid() AS uuid, firstNames, lastNames
WITH uuid, firstNames[toInteger(rand() * size(firstNames))] AS firstName, lastNames[toInteger(rand() * size(lastNames))] AS lastName
CREATE (u:User {id: uuid, name: firstName, surnames: lastName});

// Create Communities with realistic names and UUIDs
WITH [
  'Save the Children', 'Green Earth', 'Animal Rescue', 'Food for All', 'Clean Water Initiative',
  'Education for Everyone', 'Healthcare Access', 'Housing for Homeless', 'Job Training Programs', 'Mental Health Support',
  'Disaster Relief', 'Youth Empowerment', 'Elderly Care', 'Women\'s Rights', 'LGBTQ+ Support',
  'Veterans Assistance', 'Arts and Culture', 'Sports for All', 'Technology for Good', 'Environmental Protection',
  'Community Development', 'Public Safety', 'Human Rights', 'Poverty Alleviation', 'Refugee Support',
  'Child Protection', 'Animal Welfare', 'Sustainable Agriculture', 'Renewable Energy', 'Urban Gardening',
  'Clean Air Initiative', 'Ocean Conservation', 'Wildlife Preservation', 'Forest Protection', 'Climate Action',
  'Recycling Programs', 'Zero Waste', 'Green Transportation', 'Energy Efficiency', 'Water Conservation',
  'Biodiversity', 'Sustainable Tourism', 'Eco-friendly Products', 'Green Building', 'Sustainable Fashion',
  'Fair Trade', 'Organic Farming', 'Green Finance', 'Circular Economy', 'Carbon Neutrality'
] AS communities
UNWIND communities AS community
CREATE (c:Community {id: apoc.create.uuid(), name: community});

// Create Relationships between Users and Communities
MATCH (u:User), (c:Community)
WITH u, c
WHERE rand() < 0.1 // 10% chance to create a relationship
CREATE (u)-[:IS_MEMBER_OF]->(c);

// Create FOLLOWS relationships between Users
MATCH (u1:User), (u2:User)
WITH u1, u2
WHERE u1 <> u2 AND rand() < 0.05 // 5% chance to create a follows relationship
CREATE (u1)-[:FOLLOWS]->(u2);