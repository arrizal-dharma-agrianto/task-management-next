'use client';

import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  MessageCircle, 
  ChartNoAxesColumn,
  Zap,
  Shield
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Intuitive Workspace",
    description: "Organize projects with drag-and-drop simplicity. Customize boards to match your workflow."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Real-time updates keep everyone aligned. Assign tasks and track progress together."
  },
  {
    icon: MessageCircle,
    title: "Smart Notifications",
    description: "Stay informed without the noise. Get contextual updates when it matters."
  },
  {
    icon: ChartNoAxesColumn,
    title: "Analytics & Reports",
    description: "Visualize productivity with beautiful charts. Make data-driven decisions."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed and performance. Experience seamless task management."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption protects your data. Compliant with industry standards."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const iconVariants = {
  hover: {
    scale: 1.2,
    rotate: 360,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 10
    }
  }
};

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything You Need to
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed to streamline your workflow and boost team productivity.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                transition: { type: "spring" as const, stiffness: 300 }
              }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group h-full">
                <motion.div 
                  variants={iconVariants}
                  whileHover="hover"
                  className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4"
                >
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring" as const, stiffness: 300 }}
                >
                  {feature.title}
                </motion.h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
