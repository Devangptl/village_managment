import random
from datetime import datetime, timedelta

families = ["Joshi", "Verma", "Reddy", "Nair", "Iyer", "Deshmukh", "Choudhury", "Bose", "Malhotra", "Kapoor"]
genders = ["male", "female"]
occupations = ["Doctor", "Engineer", "Teacher", "Farmer", "Lawyer", "Artist", "Scientist", "Business Owner", "Chef", "Pilot"]
bios = [
    "Loves to travel and explore new cultures.",
    "A dedicated community worker.",
    "Passionate about sustainable living.",
    "Enjoys gardening and spending time with family.",
    "An avid reader and history buff.",
    "Always ready for a new challenge.",
    "Loves cooking traditional meals.",
    "Interested in modern technology.",
    "A great storyteller and humorist.",
    "Dedicated to village development."
]

def generate_random_date(start_year, end_year):
    start_date = datetime(start_year, 1, 1)
    end_date = datetime(end_year, 12, 31)
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    return (start_date + timedelta(days=random_number_of_days)).strftime('%Y-%m-%d')

people = []
relationships = []

person_id_counter = 100 # Start from 100 to avoid conflicts with manual seeds

def add_person(name, gender, birth_date, family_name, occupation=None, bio=None):
    global person_id_counter
    p = {
        "id": person_id_counter,
        "name": name,
        "gender": gender,
        "birth_date": birth_date,
        "family_name": family_name,
        "occupation": occupation or random.choice(occupations),
        "bio": bio or random.choice(bios)
    }
    people.append(p)
    person_id_counter += 1
    return p

def add_relationship(p1_id, p2_id, rel_type):
    relationships.append((p1_id, p2_id, rel_type))

for family in families:
    # Generation 1 (Grandparents)
    g1_p1 = add_person(f"G1-M-{family}", "male", generate_random_date(1940, 1950), family)
    g1_p2 = add_person(f"G1-F-{family}", "female", generate_random_date(1945, 1955), family)
    add_relationship(g1_p1["id"], g1_p2["id"], 'spouse')
    add_relationship(g1_p2["id"], g1_p1["id"], 'spouse')

    # Generation 2 (Children and their Spouses)
    num_kids = random.randint(2, 3)
    for i in range(num_kids):
        gender = random.choice(genders)
        g2_c = add_person(f"G2-C{i+1}-{family}", gender, generate_random_date(1970, 1980), family)
        add_relationship(g1_p1["id"], g2_c["id"], 'child')
        add_relationship(g1_p2["id"], g2_c["id"], 'child')

        # Add a spouse for G2
        spouse_gender = "female" if gender == "male" else "male"
        g2_s = add_person(f"G2-S{i+1}-{family}", spouse_gender, generate_random_date(1972, 1982), family)
        add_relationship(g2_c["id"], g2_s["id"], 'spouse')
        add_relationship(g2_s["id"], g2_c["id"], 'spouse')

        # Generation 3 (Grandchildren)
        num_g_kids = random.randint(1, 2)
        for j in range(num_g_kids):
            g3_c = add_person(f"G3-GC{i+1}{j+1}-{family}", random.choice(genders), generate_random_date(2000, 2010), family)
            add_relationship(g2_c["id"], g3_c["id"], 'child')
            add_relationship(g2_s["id"], g3_c["id"], 'child')

# Generate SQL
sql_output = "USE `village-management`;\n\n"
sql_output += "-- LARGE DATA SEED\n\n"

for p in people:
    sql_output += f"INSERT INTO people (id, name, gender, birth_date, family_name, occupation, bio) VALUES ({p['id']}, '{p['name']}', '{p['gender']}', '{p['birth_date']}', '{p['family_name']}', '{p['occupation']}', '{p['bio']}');\n"

sql_output += "\n"

for r in relationships:
    sql_output += f"INSERT INTO relationships (person_id, related_person_id, relationship_type) VALUES ({r[0]}, {r[1]}, '{r[2]}');\n"

with open("scripts/seed_large_data.sql", "w") as f:
    f.write(sql_output)

print(f"Generated {len(people)} people and {len(relationships)} relationships in scripts/seed_large_data.sql")
