import ContactExperience from './Contacts';

type ContactPageProps = {
    categories: Record<string, string>;
    contactMeta: {
        appName: string;
        email: string;
        phone: string | null;
        responseTime: string;
        availability: string;
        supportHours: string;
        location: string;
    };
};

export default function Contact({ categories, contactMeta }: ContactPageProps) {
    return (
        <ContactExperience categories={categories} contactMeta={contactMeta} />
    );
}
