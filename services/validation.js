export function validateForm(data)
{
    const errors = [];

    if(!data.fname || data.fname.trim() === "")
    {
        errors.push("first name is required");
    }

    if(!data.lname || data.lname.trim() === "")
    {
        errors.push("last name is required");
    }

    if(!data.email || data.email.trim() === "" || data.email.indexOf("@") === -1 || data.email.indexOf(".") === -1)
    {
        errors.push("email is required and @ and .");
    }

    if(!data.method)
    {
        errors.push("selection pickup or delivery");
    }
    else
    {
        let validOptions = ["pickup", "delivery"];
        if(!validOptions.includes(data.method))
        {
            errors.push("go away, evildoer!")
        }
    }

    if(data.size === "none")
    {
        errors.push("selection small, medium, or large");
    }
    else
    {
        let validOptions = ["small", "med", "large"];
        if(!validOptions.includes(data.method))
        {
            errors.push("go away, evildoer!")
        }
    }

    return{
        isValid: errors.length === 0,
        errors
    }
}