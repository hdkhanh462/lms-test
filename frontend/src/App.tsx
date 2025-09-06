import ClassTab from "@/components/class-tab";
import ParentTab from "@/components/parents/tab";
import StudentTab from "@/components/student/tab";
import SubscriptionTab from "@/components/subscription-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function App() {
  return (
    <main>
      <section className="container mx-auto my-8 px-4 space-y-8">
        <h1 className="text-2xl font-bold text-center">Hello world</h1>
        <Tabs defaultValue="parent">
          <TabsList>
            <TabsTrigger value="parent">Phụ huynh</TabsTrigger>
            <TabsTrigger value="student">Học sinh</TabsTrigger>
            <TabsTrigger value="class">Lớp học</TabsTrigger>
            <TabsTrigger value="subscription">Gói học</TabsTrigger>
          </TabsList>
          <TabsContent value="parent">
            <ParentTab />
          </TabsContent>
          <TabsContent value="student">
            <StudentTab />
          </TabsContent>
          <TabsContent value="class">
            <ClassTab />
          </TabsContent>
          <TabsContent value="subscription">
            <SubscriptionTab />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
