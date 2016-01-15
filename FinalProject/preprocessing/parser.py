import xml.etree.ElementTree as ET
import json

def getPHIBaseEntries():
	""" Processes XML entries in Data/PHI_accessions.xml.
		For each entry, outputs:
			RecordId, Gene, PathogenSpecies, Disease, HostSpecies, MutantPhenotype
	"""
	tree = ET.parse('../Data/PHI_accessions.xml')
	root = tree.getroot();
	entries = []

	for child in root:
		entry = {
			"RecordId": child.find("Record_ID").text,
			"Gene": child.find("Gene_name").text,
			"PathogenSpecies": child.find("Pathogen_species").text,
			"Disease": child.find("Disease_name").text,
			"HostSpecies": child.find("Experimental_host_species").text,
			"MutantPhenotype": child.find("Phenotype_of_mutant").text
		}
		entries.append(entry)
		break
	return entries

def writeToJSON(entries):
	""" Writes the given list of death details to a JSON file.
	"""
	for entry in entries:
		print(entry)
	with open('../Visualization/phi.json', 'w') as outfile:
    		json.dump(entries, outfile)

if __name__ == "__main__":
	entries = getPHIBaseEntries()
	writeToJSON(entries)
