class DatabaseReponse {
    /*
        200 OK                  // The request was successful
        400 Bad request         // Non valid request
        401 Unauthorized        // The user is not logged in
        403 Forbidden           // The user is not allowed to access this resource
        404 Not found           // The resource was not found
        405 Method not allowed  // The method is not allowed
        409 Conflict            // The resource already exists/ Using the resource would generate errors
        500 Internal error      // Unknown/unhandled error
        501 Not implemented     // The method is not implemented yet

    */
    status: number;
    /*Informative message */
    message: string;
    /*The data returned by the request, if any. */
    data: Object;
    constructor(status: number, message: string, data: Object) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

class IStorage {
    content: Map<number, IStorable>;
    create(item: IStorable): DatabaseReponse
    {
        try {
        var newId = this.content.size + 1;
        this.content.set(newId, item);
        return new DatabaseReponse(200, "Item created and added successfully. Returnig item inserted.", item);
        } catch (error) {
            return new DatabaseReponse(400, "Internal error. Non specific ", error);
        }        
    }

    read(id: string): DatabaseReponse
    {
        try {
            var item;
            for (let [key, value] of this.content.entries()) {
                if (value.public_id == id) {
                    item = value;
                }
            }
            if (item == undefined) {
                return new DatabaseReponse(404, "Item not found", {});
            }
            return new DatabaseReponse(200, "Item found. Returning item.", item);
        } catch (error) {
            return new DatabaseReponse(400, "Internal error. Non specific ", error);
        }
    }

    update(item: IStorable): DatabaseReponse
    {
        //loop through the map and find the item with the same public_id and update it
        try {
            var found = false;
            for (let [key, value] of this.content.entries()) {
                if (value.public_id == item.public_id) {
                    this.content.set(key, item);
                    found = true;
                }
            }
            if (found == false) {
                return new DatabaseReponse(404, "Item not found", {});
            }
            return new DatabaseReponse(200, "Item updated successfully. Returning item.", item);
        }
        catch (error) {
            return new DatabaseReponse(400, "Internal error. Non specific ", error);
        }
    }

    delete(id: string): DatabaseReponse
    { 
        try {
            var found = false;
            for (let [key, value] of this.content.entries()) {
                if (value.public_id == id) {
                    this.content.delete(key);
                }
            }
            if (found == false) {
                return new DatabaseReponse(404, "Item not found", {});
            }
            return new DatabaseReponse(200, "Item deleted successfully. Returning item.", {});
        }
        catch (error) {
            return new DatabaseReponse(400, "Internal error. Non specific ", error);
        }
    }

    trim(): DatabaseReponse
    {
        try {
            this.content.clear();
            return new DatabaseReponse(200, "Database cleared successfully.", {});
        }
        catch (error) {
            return new DatabaseReponse(400, "Internal error. Non specific ", error);
        }
    }
}


interface IStorable {
    // id used to identify the object outside the database
    public_id: string;
}

class User implements IStorable {
    public_id: string;
    name: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    location: [number, number];
    isVendor: boolean;
    isVerified: boolean;
}

class Product implements IStorable {
    public_id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    vendorId: number;
}