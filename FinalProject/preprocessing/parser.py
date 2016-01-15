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
		recordIdEl = child.find("Record_ID")
		geneEl = child.find("Gene_name")
		pathogenSpeciesEl = child.find("Pathogen_species")
		diseaseEl = child.find("Disease_name")
		hostSpeciesEl = child.find("Experimental_host_species")
		mutantPhenotypeEl = child.find("Phenotype_of_mutant")

		entry = {
			"RecordId": recordIdEl.text if recordIdEl is not None else "",
			"Gene": geneEl.text if geneEl is not None else "",
			"PathogenSpecies": pathogenSpeciesEl.text if pathogenSpeciesEl is not None else "",
			"Disease": diseaseEl.text if diseaseEl is not None else "",
			"HostSpecies": hostSpeciesEl.text if hostSpeciesEl is not None else "",
			"MutantPhenotype": mutantPhenotypeEl.text if mutantPhenotypeEl is not None else ""
		}
		entries.append(entry)
	return entries

def writeToJSON(entries):
	""" Writes the given list of death details to a JSON file.
	"""
	with open('../Visualization/phi.json', 'w') as outfile:
    		json.dump(entries, outfile)

if __name__ == "__main__":
	entries = getPHIBaseEntries()
	writeToJSON(entries)
