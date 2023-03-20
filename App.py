def calculate_infinity_bottle_proof():
    # Initialize the total volume and alcohol content of the bottle
    total_volume = 0
    total_alcohol = 0
    # Initialize lists to store the characteristics of each bourbon added
    bourbon_list = []
    age_list = []
    proof_list = []
    size_list = []
    
    # Loop to allow user to input each shot and its characteristics
    while True:
        # Ask the user for the bourbon name, age, proof, and shot size
        bourbon = input("Enter the name of the bourbon (or 'done' if you're finished): ")
        if bourbon == "done":
            break
        age = int(input("Enter the age of the bourbon (in years): "))
        proof = float(input("Enter the proof of the bourbon (as a percentage, e.g. 45): "))
        size = float(input("Enter the size of the shot (in fluid ounces): "))
        
        # Calculate the volume and alcohol content of the current shot
        shot_volume = size / 33.814 # Convert shot size from oz to liters
        shot_alcohol = proof/100 * shot_volume
        
        # Add the characteristics of the current bourbon to the lists
        bourbon_list.append(bourbon)
        age_list.append(age)
        proof_list.append(proof)
        size_list.append(size)
        
        # Calculate the total volume and alcohol content of the bottle
        total_volume += shot_volume
        total_alcohol += shot_alcohol
        
        # Calculate the proof of the current bottle
        current_proof = total_alcohol / total_volume * 100
        
        # Print the current proof and characteristics of the bottle
        print("After {} shots, the infinity bottle has a proof of {:.2f}.".format(len(bourbon_list), current_proof))
        print("Bourbon characteristics:")
        for i in range(len(bourbon_list)):
            print("- {} ({} years old, {}% ABV), {} oz".format(bourbon_list[i], age_list[i], proof_list[i], size_list[i]))