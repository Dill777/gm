"use server";
export const subscribeMail = async (email: string) => {
  const url = `https://api.sendgrid.com/v3/marketing/contacts`;

  const data = {
    contacts: [{ email: email }],
    list_ids: [process.env.SENDGRID_MAILING_ID],
  };

  const headers = {
    Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
    "Content-Type": "application/json",
  };

  const options = {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    if (json.errors) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};
