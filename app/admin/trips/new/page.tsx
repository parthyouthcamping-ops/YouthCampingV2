import TripForm from "@/components/admin/TripForm";

export default function NewTripPage() {
    return (
        <div className="flex flex-col gap-10">
            <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Create New Trip</h2>
                <p className="text-gray-500 font-medium font-montserrat tracking-widest uppercase text-xs">Standardize your travel offerings.</p>
            </div>
            <TripForm />
        </div>
    );
}
