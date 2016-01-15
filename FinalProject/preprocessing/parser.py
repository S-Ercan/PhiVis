import xml.etree.ElementTree as ET
import json

inputFile = '../Data/PHI_accessions.xml'
outputFile = '../Visualization/phi.json'

def getPHIBaseEntries():
	""" Processes XML entries in Data/PHI_accessions.xml.
		For each entry, outputs:
			RecordId, Gene, PathogenSpecies, Disease, HostSpecies, MutantPhenotype
	"""
	print("Reading data from '{:s}'...".format(inputFile))
	tree = ET.parse(inputFile)
	root = tree.getroot();
	entries = []

	print("Processing {:d} entries...".format(len(root)))
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
	print("Writing output to '{:s}'...".format(outputFile))
	with open(outputFile, 'w') as outfile:
    		json.dump(entries, outfile)

if __name__ == "__main__":
	entries = getPHIBaseEntries()
	writeToJSON(entries)
