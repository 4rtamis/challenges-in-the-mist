import BasicInfoForm from "./editor/BasicInfoForm";
import TagsStatusesForm from "./editor/TagsStatusesForm";
import MightForm from "./editor/MightForm";
import LimitsForm from "./editor/LimitsForm";
import ThreatsForm from "./editor/ThreatsForm";
import SpecialFeaturesForm from "./editor/SpecialFeaturesForm";
import MetaForm from "./editor/MetaForm";
import LivePreview from "./preview/LivePreview";

export default function App() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Editor */}
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Challenge Editor</h1>

        <section id="section-basic" className="space-y-2">
          <h2 className="text-lg font-semibold">Basic Info</h2>
          <BasicInfoForm />
        </section>

        <section id="section-tags" className="space-y-2">
          <h2 className="text-lg font-semibold">Tags & Statuses</h2>
          <TagsStatusesForm />
        </section>

        <section id="section-might" className="space-y-2">
          <h2 className="text-lg font-semibold">Might</h2>
          <MightForm />
        </section>

        <section id="section-limits" className="space-y-2">
          <h2 className="text-lg font-semibold">Limits</h2>
          <LimitsForm />
        </section>

        <section id="section-threats" className="space-y-2">
          <h2 className="text-lg font-semibold">Threats & Consequences</h2>
          <ThreatsForm />
        </section>

        <section id="section-features" className="space-y-2">
          <h2 className="text-lg font-semibold">Special Features</h2>
          <SpecialFeaturesForm />
        </section>

        <section id="section-meta" className="space-y-2">
          <h2 className="text-lg font-semibold">Meta</h2>
          <MetaForm />
        </section>
      </div>

      {/* Live Preview */}
      <div>
        <LivePreview />
      </div>
    </div>
  );
}
